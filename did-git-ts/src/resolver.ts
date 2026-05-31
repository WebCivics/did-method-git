import { KeysExtractor, KeyType } from './keys';
import { execSync } from 'child_process';

export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyPem?: string;
}

export interface DidDocument {
    '@context': string | string[];
    id: string;
    verificationMethod?: VerificationMethod[];
}

export class Resolver {
    private repoPath: string;

    constructor(repoPath: string) {
        this.repoPath = repoPath;
    }

    /**
     * Resolves a standard W3C DID Document from a git repository.
     * Uses the current HEAD if no specific commit hash is provided.
     */
    public resolve(did: string, targetCommit?: string): DidDocument {
        // Resolve the commit hash to traverse history
        const hash = targetCommit || this.getHeadHash();
        
        const keys = KeysExtractor.extractKeys(this.repoPath, hash);
        const verificationMethod: VerificationMethod[] = [];

        keys.forEach((key, index) => {
            let typeStr = 'UnknownVerificationKey';
            
            switch (key.keyType) {
                case KeyType.SshEd25519: typeStr = 'Ed25519VerificationKey2020'; break;
                case KeyType.SshEcdsa: typeStr = 'EcdsaSecp256k1VerificationKey2019'; break;
                case KeyType.SshRsa: typeStr = 'RsaVerificationKey2018'; break;
                case KeyType.Pgp: typeStr = 'PgpVerificationKey2021'; break;
                case KeyType.X509: typeStr = 'JsonWebKey2020'; break;
            }

            verificationMethod.push({
                id: `${did}#keys-${index + 1}`,
                type: typeStr,
                controller: did,
                publicKeyPem: key.keyMaterial
            });
        });

        return {
            '@context': 'https://www.w3.org/ns/did/v1',
            id: did,
            verificationMethod
        };
    }

    private getHeadHash(): string {
        try {
            return execSync(`git -C ${this.repoPath} rev-parse HEAD`).toString().trim();
        } catch (error) {
            throw new Error(`Failed to resolve HEAD in repository: ${this.repoPath}`);
        }
    }
}
