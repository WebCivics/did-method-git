# DID-GIT
A DID for Git Protocol

## STATUS
init.  only just begun, and work is incomplete - indeed, its only just started.

## Description
Name: did:git
Description: A decentralized identifier (DID) method for the Git protocol.
Operations:
- Create: Creates a new Git repository.
- Update: Commits changes to an existing Git repository.
- Read: Fetches the latest version of a Git repository.
- Deactivate: Deletes a Git repository.
- Fork: Fork a Repo
- Pull: 
- Push:
- hash:
- sign:
- verify:
- commit:
- merge:
- init:
- keys
  - GPG
  - SSH

- etc.

## incomplete example;


Document Format:
``json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "publicKey": [
    {
      "id": "#keys-1",
      "type": "RsaVerificationKey2018",
      "owner": "did:git:<repository-name>",
      "publicKeyPem": "<RSA public key>"
    }
  ]
}
``

### note
this method is intended to benefit from [DID:SSH](https://github.com/WebCivics/did-method-ssh).