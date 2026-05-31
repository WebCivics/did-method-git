# W3C DID Specification Registries Submission

This folder contains the required files for submitting the `did:git` method to the [W3C DID Specification Registries](https://github.com/w3c/did-spec-registries).

## Submission Steps

When you are ready to submit the `did:git` method to the upstream W3C registry, follow these steps:

1. Fork the [w3c/did-spec-registries](https://github.com/w3c/did-spec-registries) repository.
2. Copy the `docs/did-git.json` file from this repository into the `contexts/methods` (or `methods`) directory of your fork.
3. Commit and push the changes to your fork.
4. Open a Pull Request against the W3C repository.

## PR Description Template

You can use the following template for your Pull Request description:

```markdown
### Registering the `did:git` Method

This PR registers the `did:git` method in the W3C DID Specification Registries.

- **Method Name:** git
- **Specification URL:** https://webcivics.github.io/did-method-git
- **VDR:** Established natively via the Git protocol, utilizing PGP/SSH signatures.

**Description:**
The `did:git` method provides decentralized identity and verifiable history natively through Git. It utilizes a layered architecture, where the base method relies purely on Git protocol mechanisms, while the optional "Permissive Commons Profile" leverages `gitmark` for Bitcoin anchoring to track obligation costs and mitigate "digital slavery" in the commons informatics supply chain.

We affirm that the specification meets all the normative requirements for a DID Method Specification as detailed in the DID Core 1.1 Specification.
```
