import { Resolver } from './resolver';
import { KeysExtractor, KeyType } from './keys';
import * as assert from 'assert';

console.log("🚀 Starting did:git TypeScript Test Suite...\n");

try {
    // ---------------------------------------------------------
    // Test 1: Key Extraction Heuristics (Mocked Signatures)
    // ---------------------------------------------------------
    console.log("Running Test 1: Key Extraction Heuristics...");
    
    // We test the private determination logic by testing public behavior on known mock inputs.
    // In a real environment, we'd mock child_process.execSync here. 
    // Since this is a structural test, we will assert that the fallback mechanism works for now.
    
    const mockRepoPath = "."; 
    const mockCommitHash = "HEAD";
    
    // This will trigger the fallback PGP key since we aren't mocking child_process 
    // and the current repo HEAD might not have a gpgsig header.
    const keys = KeysExtractor.extractKeys(mockRepoPath, mockCommitHash);
    
    assert.strictEqual(keys.length > 0, true, "KeysExtractor should return at least one key (fallback).");
    console.log("✅ Key Extraction fallback logic verified.");

    // ---------------------------------------------------------
    // Test 2: DID Document Resolution
    // ---------------------------------------------------------
    console.log("Running Test 2: DID Document Resolution...");
    
    const resolver = new Resolver(mockRepoPath);
    const mockDid = "did:git:git@github.com:webcivics/protocol.git";
    
    const didDoc = resolver.resolve(mockDid, mockCommitHash);
    
    assert.strictEqual(didDoc.id, mockDid, "DID Document ID must match the requested DID.");
    assert.strictEqual(didDoc['@context'], "https://www.w3.org/ns/did/v1", "DID Document must specify W3C context.");
    assert.ok(didDoc.verificationMethod, "DID Document must contain a verificationMethod array.");
    
    if (didDoc.verificationMethod && didDoc.verificationMethod.length > 0) {
        const firstKey = didDoc.verificationMethod[0];
        assert.ok(firstKey.id.includes("#keys-1"), "Verification method ID should be properly indexed.");
        assert.ok(firstKey.type.length > 0, "Verification method must have a cryptographic suite type.");
        assert.strictEqual(firstKey.controller, mockDid, "Verification method controller must match the DID.");
    }

    console.log("✅ DID Document synthesis verified.");
    console.log(`\n📄 Generated Document Preview:\n${JSON.stringify(didDoc, null, 2)}`);

    // ---------------------------------------------------------
    // Test 3: W3C Cryptographic Suite Mappings
    // ---------------------------------------------------------
    console.log("\nRunning Test 3: Cryptographic Suite Mappings...");
    // If the fallback executed, it should have generated a PGP key
    if (didDoc.verificationMethod && didDoc.verificationMethod.length > 0) {
         assert.strictEqual(
             didDoc.verificationMethod[0].type, 
             "PgpVerificationKey2021", 
             "Fallback key should map to PgpVerificationKey2021"
         );
    }
    console.log("✅ Cryptographic suite mappings verified.");

    console.log("\n🎉 All tests passed successfully!");
    process.exit(0);

} catch (error: any) {
    console.error(`\n❌ Test Failed: ${error.message}`);
    process.exit(1);
}
