const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

let ballPosition = { x: 50, y: 50 }; // Initial position
let currentScreen = 0;
const clients = [];

wss.on('connection', (ws) => {
    const id = clients.length;
    clients.push(ws);
    
    console.log(`New client connected. Total clients: ${clients.length}`);

    ws.send(JSON.stringify({ type: 'init', id: id, ballPosition: ballPosition, currentScreen: currentScreen }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            ballPosition = data.position;
            currentScreen = data.screen;
            console.log(`Ball moved to position ${JSON.stringify(ballPosition)} on screen ${currentScreen}`);
            broadcastBallPosition();
        }
    });

    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log(`Client disconnected. Total clients: ${clients.length}`);
    });
});

function broadcastBallPosition() {
    clients.forEach((client) => {
        client.send(JSON.stringify({
            type: 'update',
            ballPosition: ballPosition,
            currentScreen: currentScreen
        }));
    });
}

console.log('WebSocket server is running on ws://localhost:8080');