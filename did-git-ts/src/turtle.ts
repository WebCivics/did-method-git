import { DidDocument } from './resolver';

export class TurtleSerializer {
    /**
     * Synthesizes a valid RDF Turtle (.ttl) string from a JSON-LD DID Document.
     * Uses standard FOAF, CERT, and XSD vocabularies for WebID interoperability.
     */
    static serialize(didDoc: DidDocument): string {
        const did = didDoc.id;
        
        let turtle = `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n`;
        turtle += `@prefix foaf: <http://xmlns.com/foaf/0.1/> .\n`;
        turtle += `@prefix cert: <http://www.w3.org/ns/auth/cert#> .\n`;
        turtle += `@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n`;
        
        // Define the Agent
        turtle += `<${did}>\n`;
        turtle += `    a foaf:Agent ;\n`;
        
        if (didDoc.verificationMethod && didDoc.verificationMethod.length > 0) {
            turtle += `    cert:key `;
            const keys = didDoc.verificationMethod.map(key => `<${key.id}>`);
            turtle += keys.join(', ') + ' .\n\n';
            
            // Define each key block
            didDoc.verificationMethod.forEach(key => {
                turtle += `<${key.id}>\n`;
                
                // Fallback basic cert mapping based on string heuristics
                if (key.type.includes('Rsa')) {
                    turtle += `    a cert:RSAPublicKey ;\n`;
                } else {
                    turtle += `    a cert:Key ;\n`;
                }
                
                if (key.publicKeyPem) {
                    // Escape multiline PEM string
                    const escapedPem = key.publicKeyPem.replace(/\n/g, '\\n');
                    turtle += `    cert:pem """${escapedPem}""" .\n\n`;
                } else {
                    turtle += `    rdfs:label "Key Definition" .\n\n`;
                }
            });
        } else {
            turtle += `    rdfs:label "DID Agent without configured keys" .\n\n`;
        }

        return turtle.trim();
    }
}
