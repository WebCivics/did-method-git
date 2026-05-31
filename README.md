# did:git

A Decentralized Identifier (DID) method for the Git protocol.

## Vision and Architecture

The `did:git` method is designed with a layered architecture:

1. **Base `did:git`**: Provides decentralized identifiers and verifiable history purely through the Git protocol, utilizing PGP/SSH commit signatures to build DID Documents.
2. **Permissive Commons Profile**: A specialized extension of `did:git` designed to strip "digital slavery" out of the commons informatics supply chain by embedding licensing and financial obligations into the version control workflow.

### The Permissive Commons Profile

While `gitmark` is optional for the base DID method, the Permissive Commons profile **requires** `gitmark` (https://git-mark.com/):
- Content may be provided under licenses that assert an initial "obligation cost".
- Users can contribute towards paying down these obligation costs.
- `gitmark` is used to immutably track these contributions on the Bitcoin blockchain.
- Once obligations are fully extinguished (compensated), the work automatically transitions to being freely available without further payment.
- The method also supports fee-less shared resources for purely personal or group collaboration where no payment obligation exists.
- **Encrypted Private Commons:** Support for private shared resources (e.g., personal relationship logs). Access and payload encryption are restricted exclusively to authorized `did:git` identified users by leveraging the SSH and PGP keys declared in their DID Documents.
- **Nym Mixnet Integration:** Network-level privacy and transport anonymization is supported by routing Git operations over the Nym mixnet, hiding IP addresses and relationship metadata from centralized hosts.

## Interactive Playground

We have built an interactive Web Application to help you understand how Git History natively powers W3C Decentralized Identifiers. 

👉 **[Try the did:git Playground!](https://webcivics.github.io/did-method-git/playground/index.html)**

## Specification

The DID specification is actively being developed. See `index.html` for the ReSpec document detailing the method, resolution, and security considerations.

## Core Libraries (`did-git-rs` & `did-git-ts`)

This repository contains robust reference implementations for `did:git` in both **Rust** (`did-git-rs`) and **TypeScript/Node.js** (`did-git-ts`).

### TypeScript / Node.js (`did-git-ts`)
The `did-git-ts` library natively interacts with the host's `git` binary to resolve decentralized identifiers directly within JavaScript applications, making it perfectly suited for web wallets and credential verification services.

### Rust (`did-git-rs`)
A high-performance Rust library leveraging `git2` for embedded systems and backend resolvers.

### Shared Capabilities:

- **Create**: Initialize a repository and establish the genesis DID state.
- **Update**: Commit changes and sign with configured PGP/SSH keys.
- **Resolve**: Extract DID Document state dynamically from git commit history and metadata.
- **Deactivate**: Tombstone a repository identity.
- **Obligations**: Parse and evaluate obligation states (permissive commons transition logic).
- **Anchoring**: Native wrappers around `gitmark` to anchor commits to the Bitcoin blockchain.

## Getting Started

*(Work In Progress: Setup instructions for `did-git-rs` will be provided once the crate is initialized).*

## W3C DID Registry
The `docs/` folder in this repository contains the proposed entry and submission guide for the [W3C DID Spec Registries](https://w3c.github.io/did-spec-registries/#did-methods). See `docs/submission_guide.md` for instructions.
