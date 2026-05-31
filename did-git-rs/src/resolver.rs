use crate::Result;
use crate::keys::{KeyType, KeysExtractor};
use git2::Repository;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DidDocument {
    #[serde(rename = "@context")]
    pub context: String,
    pub id: String,
    #[serde(rename = "verificationMethod", skip_serializing_if = "Vec::is_empty", default)]
    pub verification_method: Vec<VerificationMethod>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerificationMethod {
    pub id: String,
    #[serde(rename = "type")]
    pub key_type: String,
    pub controller: String,
    #[serde(rename = "publicKeyPem", skip_serializing_if = "Option::is_none")]
    pub public_key_pem: Option<String>,
}

pub struct Resolver {
    pub repo_path: String,
}

impl Resolver {
    pub fn new(repo_path: &str) -> Self {
        Self {
            repo_path: repo_path.to_string(),
        }
    }

    pub fn resolve(&self, did: &str) -> Result<DidDocument> {
        let repo = Repository::open(&self.repo_path)?;
        let head = repo.head()?;
        let target = head.target().unwrap();
        let commit_hash = target.to_string();
        
        let keys = KeysExtractor::extract_keys(&self.repo_path, &commit_hash)?;
        
        let mut verification_methods = Vec::new();
        for (i, extracted_key) in keys.iter().enumerate() {
            let key_type_str = match extracted_key.key_type {
                KeyType::SshEd25519 => "Ed25519VerificationKey2020",
                KeyType::SshEcdsa => "EcdsaSecp256k1VerificationKey2019",
                KeyType::SshRsa => "RsaVerificationKey2018",
                KeyType::Pgp => "PgpVerificationKey2021",
                KeyType::X509 => "JsonWebKey2020",
                KeyType::Unknown => "UnknownVerificationKey",
            };
            
            verification_methods.push(VerificationMethod {
                id: format!("{}#keys-{}", did, i + 1),
                key_type: key_type_str.to_string(),
                controller: did.to_string(),
                public_key_pem: Some(extracted_key.key_material.clone()),
            });
        }

        Ok(DidDocument {
            context: "https://www.w3.org/ns/did/v1".to_string(),
            id: did.to_string(),
            verification_method: verification_methods,
        })
    }
}
