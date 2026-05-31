pub mod access;
pub mod anchoring;
pub mod keys;
pub mod obligations;
pub mod registrar;
pub mod resolver;
pub mod transport;

#[derive(thiserror::Error, Debug)]
pub enum DidGitError {
    #[error("Git error: {0}")]
    Git(#[from] git2::Error),
    #[error("Serialization error: {0}")]
    Serde(#[from] serde_json::Error),
    #[error("Other error: {0}")]
    Other(String),
}

pub type Result<T> = std::result::Result<T, DidGitError>;
