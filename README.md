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

this note section is about notes.. 
this method is intended to benefit from [DID:SSH](https://github.com/WebCivics/did-method-ssh).
note also: https://en.wikipedia.org/wiki/Initiative_for_Open_Authentication

- [ ] Create
- [ ] Use
    - [ ] Present
    - [ ] Authenticate
    - [ ] Sign
    - [ ] Verify Signature
  - [ ] Read
    - [ ] Resolve
    - [ ] Dereference
    - [ ] Audit
  - [ ] Update
    - [ ] Rotate
    - [ ] Modify Service EndPoint
    - [ ] Forward / Migrate
    - [ ] Recover
  - [ ] Delete
    - [ ] Deactivate

https://www.w3.org/TR/did-spec-registries/

- [ ] did document properties
  - [ ] id
  - [ ] alsoKnownAs
  - [ ] controller
  - [ ] verificationMethod
  - [ ] publicKey
  - [ ] service
- [ ] Other
  - [ ] DID Subject
  - [ ] DID Controller
  - [ ] Verification Methods
- [ ] verification method properties
  - [ ] publicKey 
  - [ ] RsaSignature2018
  - [ ] SHA256  ( https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints )
  - [ ] SHA-1
  - [ ] GPG (PGP)
- [ ] 2nd factor? 
  - [ ] Time-based one-time password: https://en.wikipedia.org/wiki/Time-based_one-time_password
  - [ ] HMAC-based one-time password: https://en.wikipedia.org/wiki/HMAC-based_one-time_password 


