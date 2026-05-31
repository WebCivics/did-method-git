use crate::Result;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum CommonsState {
    Obligated { cost: f64, paid: f64 },
    Permissive,
    SharedResource,
}

#[derive(Debug, Serialize, Deserialize)]
struct ObligationMetadata {
    pub target_cost: f64,
    pub is_shared_resource: bool,
}

pub struct ObligationEngine {}

impl ObligationEngine {
    /// Read the license or DID document to ascertain obligation metadata
    pub fn evaluate_state(repo_path: &str) -> Result<CommonsState> {
        let did_json_path = Path::new(repo_path).join("did.json");
        if !did_json_path.exists() {
            // Defaults to shared resource if no specific obligation metadata is asserted
            return Ok(CommonsState::SharedResource);
        }

        let content = fs::read_to_string(&did_json_path)
            .map_err(|e| crate::DidGitError::Other(e.to_string()))?;
            
        if let Ok(metadata) = serde_json::from_str::<ObligationMetadata>(&content) {
            if metadata.is_shared_resource {
                return Ok(CommonsState::SharedResource);
            }
            
            // In a full implementation, `paid` would be aggregated from `gitmark info`
            let paid = 0.0; // Mock tracked contributions
            
            if paid >= metadata.target_cost {
                Ok(CommonsState::Permissive)
            } else {
                Ok(CommonsState::Obligated { 
                    cost: metadata.target_cost, 
                    paid 
                })
            }
        } else {
            Ok(CommonsState::SharedResource)
        }
    }
}
