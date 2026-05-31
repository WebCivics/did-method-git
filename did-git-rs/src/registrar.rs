use crate::Result;
use git2::{Repository, Signature};

pub struct Registrar {
    pub repo_path: String,
}

impl Registrar {
    pub fn new(repo_path: &str) -> Self {
        Self {
            repo_path: repo_path.to_string(),
        }
    }

    pub fn create(&self) -> Result<()> {
        let repo = Repository::init(&self.repo_path)?;
        
        let sig = Signature::now("did-git", "did@git.local")?;
        let tree_id = {
            let mut index = repo.index()?;
            index.write_tree()?
        };
        let tree = repo.find_tree(tree_id)?;
        
        repo.commit(Some("HEAD"), &sig, &sig, "Genesis did:git commit", &tree, &[])?;
        Ok(())
    }

    pub fn update(&self, commit_message: &str) -> Result<()> {
        let repo = Repository::open(&self.repo_path)?;
        let mut index = repo.index()?;
        let tree_id = index.write_tree()?;
        let tree = repo.find_tree(tree_id)?;
        
        let sig = Signature::now("did-git", "did@git.local")?;
        let head = repo.head()?;
        let parent_commit = repo.find_commit(head.target().unwrap())?;
        
        repo.commit(Some("HEAD"), &sig, &sig, commit_message, &tree, &[&parent_commit])?;
        Ok(())
    }

    pub fn deactivate(&self) -> Result<()> {
        self.update("DEACTIVATE did:git")
    }
}
