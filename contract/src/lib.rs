#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

pub mod escrow;
pub mod dispute;
pub mod milestone;

// ========== DATA STRUCTURES ==========

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Project {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub title: String,
    pub description: String,
    pub total_amount: i128,
    pub token_address: Address,
    pub status: ProjectStatus,
    pub created_at: u64,
    pub completed_at: Option<u64>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProjectStatus {
    Active,
    Completed,
    Cancelled,
    Disputed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub id: u64,
    pub project_id: u64,
    pub title: String,
    pub description: String,
    pub amount: i128,
    pub status: MilestoneStatus,
    pub created_at: u64,
    pub completed_at: Option<u64>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    InProgress,
    Submitted,
    Approved,
    Rejected,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Dispute {
    pub id: u64,
    pub project_id: u64,
    pub milestone_id: u64,
    pub raised_by: Address,
    pub reason: String,
    pub status: DisputeStatus,
    pub created_at: u64,
    pub resolved_at: Option<u64>,
    pub resolution: Option<String>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DisputeStatus {
    Open,
    UnderReview,
    Resolved,
    Rejected,
}

// ========== ERRORS ==========

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum MilestoneError {
    NotAuthorized = 1,
    ProjectNotFound = 2,
    MilestoneNotFound = 3,
    InvalidAmount = 4,
    InsufficientBalance = 5,
    ProjectNotActive = 6,
    MilestoneNotPending = 7,
    DisputeNotFound = 8,
    DisputeAlreadyResolved = 9,
    AlreadyInitialized = 10,
    NotInitialized = 11,
    ContractPaused = 12,
    InvalidMilestoneOrder = 13,
    CannotReleaseLocked = 14,
}

// ========== STORAGE KEYS ==========

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Project(u64),
    ProjectCount,
    NextProjectId,
    Milestone(u64, u64),
    MilestoneCount(u64),
    Dispute(u64),
    DisputeCount,
    EscrowBalance(u64),
    Config,
    Paused,
    Version,
}

// ========== CONTRACT ==========

#[contract]
pub struct MilestoneTrust;

#[contractimpl]
impl MilestoneTrust {
    pub fn initialize(env: Env, admin: Address) -> Result<(), MilestoneError> {
        if env.storage().instance().has(&DataKey::Version) {
            return Err(MilestoneError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Version, &1u32);
        env.storage().instance().set(&DataKey::ProjectCount, &0u64);
        env.storage().instance().set(&DataKey::DisputeCount, &0u64);
        env.storage().instance().set(&DataKey::NextProjectId, &1u64);
        env.storage().instance().set(&DataKey::Paused, &false);

        Ok(())
    }

    pub fn is_paused(env: Env) -> bool {
        env.storage().instance().get(&DataKey::Paused).unwrap_or(false)
    }

    pub fn set_paused(env: Env, admin: Address, paused: bool) -> Result<(), MilestoneError> {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &paused);
        Ok(())
    }

    // ========== PROJECT FUNCTIONS ==========

    pub fn create_project(
        env: Env,
        client: Address,
        freelancer: Address,
        title: String,
        description: String,
        total_amount: i128,
        token_address: Address,
    ) -> Result<u64, MilestoneError> {
        escrow::create_project(env, client, freelancer, title, description, total_amount, token_address)
    }

    pub fn get_project(env: Env, project_id: u64) -> Option<Project> {
        escrow::get_project(env, project_id)
    }

    pub fn get_escrow_balance(env: Env, project_id: u64) -> i128 {
        escrow::get_escrow_balance(env, project_id)
    }

    pub fn release_milestone_payment(
        env: Env,
        client: Address,
        project_id: u64,
        milestone_id: u64,
    ) -> Result<(), MilestoneError> {
        escrow::release_milestone_payment(env, client, project_id, milestone_id)
    }

    pub fn withdraw_remaining(
        env: Env,
        client: Address,
        project_id: u64,
    ) -> Result<i128, MilestoneError> {
        escrow::withdraw_remaining(env, client, project_id)
    }

    // ========== MILESTONE FUNCTIONS ==========

    pub fn add_milestone(
        env: Env,
        client: Address,
        project_id: u64,
        title: String,
        description: String,
        amount: i128,
    ) -> Result<u64, MilestoneError> {
        milestone::add_milestone(env, client, project_id, title, description, amount)
    }

    pub fn get_milestone(env: Env, project_id: u64, milestone_id: u64) -> Option<Milestone> {
        milestone::get_milestone(env, project_id, milestone_id)
    }

    pub fn get_all_milestones(env: Env, project_id: u64) -> Vec<Milestone> {
        milestone::get_all_milestones(env, project_id)
    }

    pub fn submit_milestone(
        env: Env,
        freelancer: Address,
        project_id: u64,
        milestone_id: u64,
    ) -> Result<(), MilestoneError> {
        milestone::submit_milestone(env, freelancer, project_id, milestone_id)
    }

    pub fn start_milestone(
        env: Env,
        freelancer: Address,
        project_id: u64,
        milestone_id: u64,
    ) -> Result<(), MilestoneError> {
        milestone::start_milestone(env, freelancer, project_id, milestone_id)
    }

    // ========== DISPUTE FUNCTIONS ==========

    pub fn raise_dispute(
        env: Env,
        raised_by: Address,
        project_id: u64,
        milestone_id: u64,
        reason: String,
    ) -> Result<u64, MilestoneError> {
        dispute::raise_dispute(env, raised_by, project_id, milestone_id, reason)
    }

    pub fn resolve_dispute(
        env: Env,
        resolver: Address,
        dispute_id: u64,
        resolution: String,
        refund_amount: i128,
        release_amount: i128,
    ) -> Result<(), MilestoneError> {
        dispute::resolve_dispute(env, resolver, dispute_id, resolution, refund_amount, release_amount)
    }

    pub fn get_dispute(env: Env, dispute_id: u64) -> Option<Dispute> {
        dispute::get_dispute(env, dispute_id)
    }
}

#[cfg(test)]
mod test;