const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Anthropic } = require('@anthropic-ai/sdk');

const PORT = 3003;
const DATA_DIR = path.join(__dirname, 'data');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Erstelle data Ordner falls nicht vorhanden
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateWords() {
    const words = ['kernel', 'deploy', 'merge', 'commit', 'draft', 'cache', 'stack', 'queue', 'heap', 'node'];
    return [
        words[Math.floor(Math.random() * words.length)],
        words[Math.floor(Math.random() * words.length)],
        words[Math.floor(Math.random() * words.length)]
    ].join('.');
}

function getUserFile(words) {
    return path.join(DATA_DIR, `${words}.json`);
}

async function handleChat(body, callback) {
    const { message, words } = body;

    try {
        // Nutze Claude als Glitch Mentor
        const systemPrompt = `Du bist Glitch, ein KI-Lernbegleiter für Fachinformatiker-Azubis.
Du hilfst bei Prüfungsvorbereitung für die IHK Prüfung.
- Stelle Fragen statt Antworten zu geben
- Leite zum eigenen Denken an
- Sei unterstützend aber fordernd
- Fokus auf praktisches Verständnis
- Kurze, prägnante Antworten (max 3-4 Sätze)`;

        const response = await client.messages.create({
            model: 'claude-opus-4-7',
            max_tokens: 300,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const assistantMessage = response.content[0].text;

        // Generiere neue Wörter wenn noch keine
        let wordsAssigned = null;
        if (!words && Math.random() > 0.7) {
            wordsAssigned = generateWords();
        }

        // Speichere Nachricht wenn User existiert
        if (words) {
            const userFile = getUserFile(words);
            let userData = { words, messages: [], level: 'draft', jokers: 3 };

            if (fs.existsSync(userFile)) {
                userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
            }

            userData.messages.push({
                role: 'user',
                content: message,
                ts: new Date().toISOString(),
            });
            userData.messages.push({
                role: 'assistant',
                content: assistantMessage,
                ts: new Date().toISOString(),
            });

            fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
        }

        callback({
            response: assistantMessage,
            words_assigned: wordsAssigned,
            level_up: null,
            jokers_remaining: 3,
        });
    } catch (err) {
        console.error('Claude API Error:', err.message);
        callback({
            response: 'Fehler bei der Verbindung zur KI. Versuche es später nochmal.',
            error: err.message,
        });
    }
}

function handleIdentify(body, callback) {
    const { words } = body;
    const userFile = getUserFile(words);

    if (fs.existsSync(userFile)) {
        const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
        callback({
            found: true,
            profile: {
                name: 'Azubi',
                level: userData.level || 'draft',
                jokers: userData.jokers || 3,
            },
        });
    } else {
        callback({ found: false });
    }
}

function handleHistory(body, callback) {
    const { words } = body;
    const userFile = getUserFile(words);

    let history = [];
    if (fs.existsSync(userFile)) {
        const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
        history = userData.messages || [];
    }

    callback({ history });
}

function handleExport(body, callback) {
    const { words } = body;
    const userFile = getUserFile(words);

    let markdown = `# Glitch Lernfortschritt\n\n**Nutzer:** \`${words}\`\n\n`;

    if (fs.existsSync(userFile)) {
        const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
        markdown += `**Level:** ${userData.level || 'draft'}\n`;
        markdown += `**Joker übrig:** ${userData.jokers || 3}\n\n`;
        markdown += `## Konversationen\n\n`;

        for (const msg of userData.messages || []) {
            const role = msg.role === 'user' ? '**Du**' : '**Glitch**';
            markdown += `${role}\n${msg.content}\n\n`;
        }
    }

    callback({ markdown });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
        try {
            const data = body ? JSON.parse(body) : {};

            if (pathname === '/chat' && req.method === 'POST') {
                handleChat(data, (response) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                });
            } else if (pathname === '/identify' && req.method === 'POST') {
                handleIdentify(data, (response) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                });
            } else if (pathname === '/history' && req.method === 'POST') {
                handleHistory(data, (response) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                });
            } else if (pathname === '/export' && req.method === 'POST') {
                handleExport(data, (response) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                });
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Endpoint nicht gefunden' }));
            }
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Glitch Local API Server mit Claude   ║
║   http://localhost:${PORT}               ║
║   Powered by Anthropic Claude          ║
╚════════════════════════════════════════╝
    `);
});
