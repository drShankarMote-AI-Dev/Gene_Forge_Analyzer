const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isWindows = os.platform() === 'win32';
const serverDir = path.join(__dirname, '../apps/backend');
const venvDir = path.join(serverDir, '.venv');

const pythonGlobal = isWindows ? 'python' : 'python3';
const venvPythonBox = isWindows ? path.join(venvDir, 'Scripts', 'python.exe') : path.join(venvDir, 'bin', 'python');
const venvPipBox = isWindows ? path.join(venvDir, 'Scripts', 'pip.exe') : path.join(venvDir, 'bin', 'pip');

function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`> ${command} ${args.join(' ')}`);
        const proc = spawn(command, args, {
            cwd: cwd || serverDir,
            shell: true,
            stdio: 'inherit',
            env: { ...process.env, PYTHONUNBUFFERED: '1' } // Ensure python output is streamed
        });

        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
    });
}

async function start() {
    try {
        // 1. Check/Create Virtual Env
        if (!fs.existsSync(venvDir)) {
            console.log('Creating virtual environment...');
            await runCommand(pythonGlobal, ['-m', 'venv', '.venv']);
        }

        // 2. Install Requirements
        console.log('Installing dependencies...');
        // On Windows sometimes we need to be careful with paths in shell=true, but usually fine.
        // Fallback to global pip if venv pip fails? No, strict venv.
        await runCommand(venvPipBox, ['install', '-r', 'requirements.txt']);

        // 3. Run App
        console.log('Starting Flask Server...');
        await runCommand(venvPythonBox, ['app.py']);

    } catch (error) {
        console.error('Failed to start backend:', error.message);
        process.exit(1);
    }
}

start();
