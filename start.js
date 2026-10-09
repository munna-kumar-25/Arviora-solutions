const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

const children = [];
let stopping = false;

function isPortAvailable(port) {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host: '127.0.0.1', port });

        socket.setTimeout(500);
        socket.once('connect', () => {
            socket.destroy();
            resolve(false);
        });
        socket.once('timeout', () => {
            socket.destroy();
            resolve(true);
        });
        socket.once('error', () => {
            socket.destroy();
            resolve(true);
        });
    });
}

async function findAvailablePort(firstPort, lastPort) {
    for (let port = firstPort; port <= lastPort; port += 1) {
        if (await isPortAvailable(port)) {
            return port;
        }
    }

    throw new Error(`No available port between ${firstPort} and ${lastPort}.`);
}

function stop(exitCode) {
    if (stopping) {
        return;
    }

    stopping = true;
    process.exitCode = exitCode;

    for (const child of children) {
        if (!child.killed) {
            child.kill('SIGTERM');
        }
    }
}

function startService(name, directory, entryPoint, port, extraEnvironment = {}) {
    console.log(`Starting ${name} on port ${port}...`);

    const child = spawn(process.execPath, [entryPoint], {
        cwd: path.join(__dirname, directory),
        env: { ...process.env, PORT: String(port), ...extraEnvironment },
        stdio: 'inherit',
    });
    children.push(child);

    child.on('error', (error) => {
        console.error(`Could not start ${name}: ${error.message}`);
        stop(1);
    });

    child.on('exit', (code, signal) => {
        if (!stopping) {
            const reason = signal ? `signal ${signal}` : `exit code ${code}`;
            console.error(`${name} stopped unexpectedly (${reason}).`);
            stop(1);
        }
    });
}

async function start() {
    const backendPort = await findAvailablePort(5000, 5010);
    const frontendPort = await findAvailablePort(3000, 3010);

    console.log(`Backend: http://localhost:${backendPort}/api`);
    console.log(`Frontend: http://localhost:${frontendPort}`);

    startService('Backend', 'backend', 'server.js', backendPort, {
        FRONTEND_URL: `http://localhost:${frontendPort}`,
    });
    startService(
        'Frontend',
        'frontend',
        path.join('node_modules', 'react-scripts', 'scripts', 'start.js'),
        frontendPort,
        {
            REACT_APP_API_URL: `http://localhost:${backendPort}/api`,
            REACT_APP_BACKEND_URL: `http://localhost:${backendPort}`,
        }
    );
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

start().catch((error) => {
    console.error(`Could not start Arviora Solutions: ${error.message}`);
    stop(1);
});
