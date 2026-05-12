use soroban_sdk::{Address, Env, String};
use crate::{Dispute, DisputeStatus, DataKey, MilestoneError};

pub fn raise_dispute(
    env: Env,
    raised_by: Address,
    project_id: u64,
    milestone_id: u64,
    reason: String,
) -> Result<u64, MilestoneError> {
    raised_by.require_auth();

    let project = crate::escrow::get_project(env.clone(), project_id)
        .ok_or(MilestoneError::ProjectNotFound)?;

    // Only client or freelancer can raise a dispute
    if project.client != raised_by && project.freelancer != raised_by {
        return Err(MilestoneError::NotAuthorized);
    }

    let milestone = crate::milestone::get_milestone(env.clone(), project_id, milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    // Can only dispute milestones that are submitted or in progress
    match milestone.status {
        crate::MilestoneStatus::Submitted | crate::MilestoneStatus::InProgress => {}
        _ => return Err(MilestoneError::MilestoneNotPending),
    }

    let dispute_id: u64 = env.storage().instance().get(&DataKey::DisputeCount).unwrap_or(0);
    let new_dispute_id = dispute_id + 1;

    let dispute = Dispute {
        id: new_dispute_id,
        project_id,
        milestone_id,
        raised_by: raised_by.clone(),
        reason: reason.clone(),
        status: DisputeStatus::Open,
        created_at: env.ledger().timestamp(),
        resolved_at: None,
        resolution: None,
    };

    env.storage().persistent().set(&DataKey::Dispute(new_dispute_id), &dispute);
    env.storage().instance().set(&DataKey::DisputeCount, &new_dispute_id);

    // Update project status to disputed
    let mut project = project;
    project.status = crate::ProjectStatus::Disputed;
    env.storage().persistent().set(&DataKey::Project(project_id), &project);

    Ok(new_dispute_id)
}

pub fn resolve_dispute(
    env: Env,
    resolver: Address,
    dispute_id: u64,
    resolution: String,
    refund_amount: i128,
    release_amount: i128,
) -> Result<(), MilestoneError> {
    resolver.require_auth();

    let mut dispute = env.storage().persistent()
        .get(&DataKey::Dispute(dispute_id))
        .ok_or(MilestoneError::DisputeNotFound)?;

    if dispute.status != DisputeStatus::Open {
        return Err(MilestoneError::DisputeAlreadyResolved);
    }

    let project = crate::escrow::get_project(env.clone(), dispute.project_id)
        .ok_or(MilestoneError::ProjectNotFound)?;

    let milestone = crate::milestone::get_milestone(env.clone(), dispute.project_id, dispute.milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    dispute.status = DisputeStatus::Resolved;
    dispute.resolved_at = Some(env.ledger().timestamp());
    dispute.resolution = Some(resolution);

    env.storage().persistent().set(&DataKey::Dispute(dispute_id), &dispute);

    // Process refunds and releases
    let token_client = soroban_sdk::token::Client::new(&env, &project.token_address);
    let contract = env.current_contract_address();

    if refund_amount > 0 {
        token_client.transfer(&contract, &project.client, &refund_amount);
    }

    if release_amount > 0 {
        token_client.transfer(&contract, &project.freelancer, &release_amount);
    }

    // Update escrow balance
    let current_balance = crate::escrow::get_escrow_balance(env.clone(), dispute.project_id);
    let new_balance = current_balance - refund_amount - release_amount;
    env.storage().persistent().set(&DataKey::EscrowBalance(dispute.project_id), &new_balance);

    // Update milestone status
    crate::milestone::update_milestone_status(
        env.clone(),
        dispute.project_id,
        dispute.milestone_id,
        crate::MilestoneStatus::Approved,
    )?;

    // Update project status back to active
    let mut project = project;
    project.status = crate::ProjectStatus::Active;
    env.storage().persistent().set(&DataKey::Project(dispute.project_id), &project);

    Ok(())
}

pub fn get_dispute(env: Env, dispute_id: u64) -> Option<Dispute> {
    env.storage().persistent().get(&DataKey::Dispute(dispute_id))
}

pub fn get_dispute_count(env: Env) -> u64 {
    env.storage().instance().get(&DataKey::DisputeCount).unwrap_or(0)
}