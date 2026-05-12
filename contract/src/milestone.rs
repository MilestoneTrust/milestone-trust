use soroban_sdk::{Address, Env, String, Vec};
use crate::{Milestone, MilestoneStatus, DataKey, MilestoneError};

pub fn add_milestone(
    env: Env,
    client: Address,
    project_id: u64,
    title: String,
    description: String,
    amount: i128,
) -> Result<u64, MilestoneError> {
    client.require_auth();

    if amount <= 0 {
        return Err(MilestoneError::InvalidAmount);
    }

    let milestone_count = get_milestone_count(env.clone(), project_id);
    let milestone_id = milestone_count + 1;

    let milestone = Milestone {
        id: milestone_id,
        project_id,
        title: title.clone(),
        description: description.clone(),
        amount,
        status: MilestoneStatus::Pending,
        created_at: env.ledger().timestamp(),
        completed_at: None,
    };

    env.storage().persistent().set(&DataKey::Milestone(project_id, milestone_id), &milestone);
    env.storage().persistent().set(&DataKey::MilestoneCount(project_id), &milestone_id);

    Ok(milestone_id)
}

pub fn get_milestone(env: Env, project_id: u64, milestone_id: u64) -> Option<Milestone> {
    env.storage().persistent().get(&DataKey::Milestone(project_id, milestone_id))
}

pub fn get_milestone_count(env: Env, project_id: u64) -> u64 {
    env.storage().persistent().get(&DataKey::MilestoneCount(project_id)).unwrap_or(0)
}

pub fn get_all_milestones(env: Env, project_id: u64) -> Vec<Milestone> {
    let count = get_milestone_count(env.clone(), project_id);
    let mut milestones = Vec::new(&env);

    for i in 1..=count {
        if let Some(milestone) = get_milestone(env.clone(), project_id, i) {
            milestones.push_back(milestone);
        }
    }

    milestones
}

pub fn submit_milestone(
    env: Env,
    freelancer: Address,
    project_id: u64,
    milestone_id: u64,
) -> Result<(), MilestoneError> {
    freelancer.require_auth();

    let project = crate::escrow::get_project(env.clone(), project_id).ok_or(MilestoneError::ProjectNotFound)?;

    if project.freelancer != freelancer {
        return Err(MilestoneError::NotAuthorized);
    }

    let mut milestone = get_milestone(env.clone(), project_id, milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    if milestone.status != MilestoneStatus::InProgress {
        return Err(MilestoneError::MilestoneNotPending);
    }

    milestone.status = MilestoneStatus::Submitted;
    milestone.completed_at = Some(env.ledger().timestamp());

    env.storage().persistent().set(&DataKey::Milestone(project_id, milestone_id), &milestone);

    Ok(())
}

pub fn update_milestone_status(
    env: Env,
    project_id: u64,
    milestone_id: u64,
    new_status: MilestoneStatus,
) -> Result<(), MilestoneError> {
    let mut milestone = get_milestone(env.clone(), project_id, milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    milestone.status = new_status;

    if new_status == MilestoneStatus::Approved || new_status == MilestoneStatus::Rejected {
        milestone.completed_at = Some(env.ledger().timestamp());
    }

    env.storage().persistent().set(&DataKey::Milestone(project_id, milestone_id), &milestone);

    Ok(())
}

pub fn start_milestone(
    env: Env,
    freelancer: Address,
    project_id: u64,
    milestone_id: u64,
) -> Result<(), MilestoneError> {
    freelancer.require_auth();

    let project = crate::escrow::get_project(env.clone(), project_id).ok_or(MilestoneError::ProjectNotFound)?;

    if project.freelancer != freelancer {
        return Err(MilestoneError::NotAuthorized);
    }

    let mut milestone = get_milestone(env.clone(), project_id, milestone_id)
        .ok_or(MilestoneError::MilestoneNotFound)?;

    if milestone.status != MilestoneStatus::Pending {
        return Err(MilestoneError::MilestoneNotPending);
    }

    milestone.status = MilestoneStatus::InProgress;

    env.storage().persistent().set(&DataKey::Milestone(project_id, milestone_id), &milestone);

    Ok(())
}