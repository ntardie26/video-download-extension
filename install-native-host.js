const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Get the path to the native messaging host manifest
const manifestPath = path.join(__dirname, 'com.simplevideodownloader.json');

// Get the path to the native messaging host script
const scriptPath = path.join(__dirname, 'native-host.py');

// Get the target directory based on the operating system
function getTargetDir() {
    switch (process.platform) {
        case 'win32':
            return path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'NativeMessagingHosts');
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts');
        case 'linux':
            return path.join(os.homedir(), '.config', 'google-chrome', 'NativeMessagingHosts');
        default:
            throw new Error('Unsupported operating system');
    }
}

// Install native messaging host
async function installNativeHost() {
    try {
        // Create target directory if it doesn't exist
        const targetDir = getTargetDir();
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy manifest to target directory
        const targetManifestPath = path.join(targetDir, 'com.simplevideodownloader.json');
        fs.copyFileSync(manifestPath, targetManifestPath);

        // Make native host script executable
        if (process.platform !== 'win32') {
            await execAsync(`chmod +x '${scriptPath}'`);
        }

        console.log('Native messaging host installed successfully!');
        console.log('Please restart your browser for the changes to take effect.');
    } catch (error) {
        console.error('Error installing native messaging host:', error);
        process.exit(1);
    }
}

// Uninstall native messaging host
async function uninstallNativeHost() {
    try {
        const targetDir = getTargetDir();
        const targetManifestPath = path.join(targetDir, 'com.simplevideodownloader.json');

        if (fs.existsSync(targetManifestPath)) {
            fs.unlinkSync(targetManifestPath);
            console.log('Native messaging host uninstalled successfully!');
        } else {
            console.log('Native messaging host not found.');
        }
    } catch (error) {
        console.error('Error uninstalling native messaging host:', error);
        process.exit(1);
    }
}

// Handle command line arguments
const command = process.argv[2];
if (command === 'uninstall') {
    uninstallNativeHost();
} else {
    installNativeHost();
}