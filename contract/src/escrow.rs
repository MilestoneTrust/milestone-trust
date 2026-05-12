use soroban_sdk::{Address, Env, token};
use crate::{Project, ProjectStatus, Milestone, MilestoneStatus, DataKey, MilestoneError};

pub fn create_project(
    env: Env,
    client: Address,
    freelancer: Address,
    title: String,
    description: String,
    total_amount: i128,
    token_address: Address,
) -> Result<u64, MilestoneError> {
    client.require_auth();

    if total_amount <= 0 {
        return Err(MilestoneError::InvalidAmount);
    }

    let project_id: u64 = env.storage().instance().get(&DataKey::NextProjectId).unwrap_or(1);

    let project = Project {
        id: project_id,
        client: client.clone(),
        freelancer: freelancer.clone(),
        title: title.clone(),
        description: description.clone(),
        total_amount,
        token_address: token_address.clone(),
        status: ProjectStatus::Active,
        created_at: env.ledger().timestamp(),
        completed_at: None,
    };

    // Transfer funds from client to contract escrow
    let token_client = token::Client::new(&env, &token_address);
    let contract = env.current_contract_address();
    token_client.transfer(&client, &contract, &total_amount);

    // Store project
    env.storage().persistent().set(&DataKey::Project(project_id), &project);

    // Store escrow balance
    env.storage().persistent().set(&DataKey::EscrowBalance(project_id), &total_amount);

    // Update counters
    let count: u64 = env.storage().instance().get(&DataKey::ProjectCount).unwrap_or(0);
    env.storage().instance().set(&DataKey::ProjectCount, &(count + 1));
    env.storage().instance().set(&DataKey::NextProjectId, &(project_id + 1));

    Ok(project_id)
}

pub fn get_project(env: Env, project_id: u64) -> Option<Project> {
    env.storage().persistent().get(&DataKey::Project(project_id))
}

pub fn get_escrow_balance(env: Env, project_id: u64) -> i128 {
    env.storage().persistent().get(&DataKey::EscrowBalance(project_id)).unwrap_or(0)
}

pub fn release_milestone_payment(
    env: Env,
    client: Address,
    project_id: u64,
    milestone_id: u64,
) -> Result<(), MilestoneError> {
    client.require_auth();

    let project = get_project(env.clone(), project_id).ok_or(MilestoneError::ProjectNotFound)?;

    if project.status != ProjectStatus::Active {
        return Err(MilestoneError::ProjectNotActive);
    }

    if project.client != client {
        return Err(MilestoneError::NotAuthorized);
    }

    let milestone = crate::milestone::get_milestone(env.clone(), project_id, milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    if milestone.status != MilestoneStatus::Submitted {
        return Err(MilestoneError::MilestoneNotPending);
    }

    let mut escrow_balance = get_escrow_balance(env.clone(), project_id);
    if escrow_balance < milestone.amount {
        return Err(MilestoneError::InsufficientBalance);
    }

    // Transfer payment to freelancer
    let token_client = token::Client::new(&env, &project.token_address);
    let contract = env.current_contract_address();
    token_client.transfer(&contract, &project.freelancer, &milestone.amount);

    // Update escrow balance
    escrow_balance -= milestone.amount;
    env.storage().persistent().set(&DataKey::EscrowBalance(project_id), &escrow_balance);

    // Mark milestone as approved
    crate::milestone::update_milestone_status(env, project_id, milestone_id, MilestoneStatus::Approved)?;

    Ok(())
}

pub fn refund_milestone(
    env: Env,
    client: Address,
    project_id: u64,
    milestone_id: u64,
) -> Result<(), MilestoneError> {
    client.require_auth();

    let project = get_project(env.clone(), project_id).ok_or(MilestoneError::ProjectNotFound)?;

    if project.client != client {
        return Err(MilestoneError::NotAuthorized);
    }

    let milestone = crate::milestone::get_milestone(env.clone(), project_id, milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    crate::milestone::update_milestone_status(env, project_id, milestone_id, MilestoneStatus::Rejected)?;

    Ok(())
}

pub fn withdraw_remaining(
    env: Env,
    client: Address,
    project_id: u64,
) -> Result<i128, MilestoneError> {
    client.require_auth();

    let project = get_project(env.clone(), project_id).ok_or(MilestoneError::ProjectNotFound)?;

    if project.client != client {
        return Err(MilestoneError::NotAuthorized);
    }

    let escrow_balance = get_escrow_balance(env.clone(), project_id);

    if escrow_balance <= 0 {
        return Err(MilestoneError::InsufficientBalance);
    }

    let token_client = token::Client::new(&env, &project.token_address);
    let contract = env.current_contract_address();
    token_client.transfer(&contract, &client, &escrow_balance);

    env.storage().persistent().set(&DataKey::EscrowBalance(project_id), &0i128);

    Ok(escrow_balance)
}