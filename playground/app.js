// Mocked historical states of the repository
const timelineData = [
    {
        id: "commit-genesis",
        hash: "7a2f98b",
        date: "2026-01-10 14:22",
        title: "Genesis Commit (Creation)",
        badge: "State: Obligated",
        explanation: "The repository is initialized. <code>did.json</code> establishes a permissive commons with a $5,000 obligation. The commit is signed via SSH (Ed25519), anchoring the initial DID Document verification methods.",
        url: "did:git:git@github.com:webcivics/protocol.git?versionId=7a2f98b",
        didDoc: {
            "@context": ["https://www.w3.org/ns/did/v1"],
            "id": "did:git:git@github.com:webcivics/protocol.git",
            "verificationMethod": [
                {
                    "id": "did:git:git@github.com:webcivics/protocol.git#keys-1",
                    "type": "Ed25519VerificationKey2020",
                    "controller": "did:git:git@github.com:webcivics/protocol.git",
                    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEANk...\n-----END PUBLIC KEY-----"
                }
            ],
            "service": [
                {
                    "id": "#gitmark-tracker",
                    "type": "ObligationTracker",
                    "serviceEndpoint": "https://git-mark.com/target/5000"
                }
            ]
        }
    },
    {
        id: "commit-rotation",
        hash: "3b1a45c",
        date: "2026-03-05 09:11",
        title: "Key Rotation",
        badge: "State: Obligated",
        explanation: "A new maintainer joins. The <code>did.json</code> is updated via a commit signed with a PGP key. The resolver immediately translates this historical commit into an updated W3C DID document containing both the old Ed25519 and the new PGP verification method.",
        url: "did:git:git@github.com:webcivics/protocol.git?versionId=3b1a45c",
        didDoc: {
            "@context": ["https://www.w3.org/ns/did/v1"],
            "id": "did:git:git@github.com:webcivics/protocol.git",
            "verificationMethod": [
                {
                    "id": "did:git:git@github.com:webcivics/protocol.git#keys-1",
                    "type": "Ed25519VerificationKey2020",
                    "controller": "did:git:git@github.com:webcivics/protocol.git",
                    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEANk...\n-----END PUBLIC KEY-----"
                },
                {
                    "id": "did:git:git@github.com:webcivics/protocol.git#keys-2",
                    "type": "PgpVerificationKey2021",
                    "controller": "did:git:git@github.com:webcivics/protocol.git",
                    "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQINBG...\n-----END PGP PUBLIC KEY BLOCK-----"
                }
            ]
        }
    },
    {
        id: "commit-commons",
        hash: "f9e201d",
        date: "2026-05-18 16:45",
        title: "Obligation Fulfilled",
        badge: "State: Permissive Commons",
        explanation: "Contributions on the Bitcoin blockchain (via gitmark) have reached the $5,000 threshold. A script pushes a signed state-transition commit. The DID Document reflects that the resource is now a freely available <strong>Permissive Commons</strong>.",
        url: "did:git:git@github.com:webcivics/protocol.git?versionId=f9e201d",
        didDoc: {
            "@context": ["https://www.w3.org/ns/did/v1"],
            "id": "did:git:git@github.com:webcivics/protocol.git",
            "verificationMethod": [
                {
                    "id": "did:git:git@github.com:webcivics/protocol.git#keys-2",
                    "type": "PgpVerificationKey2021",
                    "controller": "did:git:git@github.com:webcivics/protocol.git",
                    "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQINBG...\n-----END PGP PUBLIC KEY BLOCK-----"
                }
            ],
            "service": [
                {
                    "id": "#gitmark-tracker",
                    "type": "ObligationTracker",
                    "serviceEndpoint": "https://git-mark.com/status/fulfilled"
                }
            ]
        }
    },
    {
        id: "commit-nym",
        hash: "99c8f2a",
        date: "2026-05-31 10:00",
        title: "Nym Mixnet Migration",
        badge: "State: Encrypted Commons",
        explanation: "The repository is migrated to a private, encrypted environment. A Nym Network Requester address is added to the DID Document. Clients resolving this specific commit history will now route all Git <code>fetch</code> and <code>push</code> operations anonymously over the Nym mixnet via SOCKS5.",
        url: "did:git:git@github.com:webcivics/protocol.git?versionId=99c8f2a",
        didDoc: {
            "@context": ["https://www.w3.org/ns/did/v1"],
            "id": "did:git:git@github.com:webcivics/protocol.git",
            "verificationMethod": [
                {
                    "id": "did:git:git@github.com:webcivics/protocol.git#keys-2",
                    "type": "PgpVerificationKey2021",
                    "controller": "did:git:git@github.com:webcivics/protocol.git",
                    "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQINBG...\n-----END PGP PUBLIC KEY BLOCK-----"
                }
            ],
            "service": [
                {
                    "id": "#nym-endpoint",
                    "type": "NymMixnetEndpoint",
                    "serviceEndpoint": "nym://a1b2c3d4e5f6.network-requester"
                }
            ]
        }
    }
];

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 4);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    
    timelineData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `timeline-item ${index === timelineData.length - 1 ? 'active' : ''}`;
        div.onclick = () => selectCommit(index);
        
        div.innerHTML = `
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-hash">commit: ${item.hash}</div>
        `;
        container.appendChild(div);
    });
}

function selectCommit(index) {
    // Update active class
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    const data = timelineData[index];
    
    // Update UI
    document.getElementById('state-badge').innerText = data.badge;
    document.getElementById('explanation-box').innerHTML = data.explanation;
    document.getElementById('did-url').innerText = data.url;
    document.getElementById('did-json').innerHTML = syntaxHighlight(data.didDoc);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    renderTimeline();
    selectCommit(timelineData.length - 1); // Select the latest commit by default
});
