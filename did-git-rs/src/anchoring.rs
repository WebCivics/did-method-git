use crate::Result;
use std::process::Command;

pub struct GitmarkAnchor {}

impl GitmarkAnchor {
    /// Wraps `git mark init`
    pub fn init(repo_path: &str, chain: &str, voucher: &str) -> Result<()> {
        let status = Command::new("git")
            .current_dir(repo_path)
            .args(&["mark", "init", "--chain", chain, "--voucher", voucher])
            .status()
            .map_err(|e| crate::DidGitError::Other(e.to_string()))?;
            
        if !status.success() {
            return Err(crate::DidGitError::Other("git mark init failed".to_string()));
        }
        Ok(())
    }

    /// Wraps `git mark`
    pub fn mark(repo_path: &str) -> Result<()> {
        let status = Command::new("git")
            .current_dir(repo_path)
            .args(&["mark"])
            .status()
            .map_err(|e| crate::DidGitError::Other(e.to_string()))?;
            
        if !status.success() {
            return Err(crate::DidGitError::Other("git mark failed".to_string()));
        }
        Ok(())
    }

    /// Wraps `git mark verify`
    pub fn verify(repo_path: &str) -> Result<bool> {
        let status = Command::new("git")
            .current_dir(repo_path)
            .args(&["mark", "verify"])
            .status()
            .map_err(|e| crate::DidGitError::Other(e.to_string()))?;
            
        Ok(status.success())
    }
}
