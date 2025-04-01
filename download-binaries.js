const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const BINARIES_DIR = path.join(__dirname, 'binaries');
const YT_DLP_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
const FFMPEG_URL = {
    win32: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip',
    linux: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz',
    darwin: 'https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip'
};
const COBALT_URL = {
    win32: 'https://github.com/weserv/cobalt/releases/latest/download/cobalt-windows-amd64.exe',
    linux: 'https://github.com/weserv/cobalt/releases/latest/download/cobalt-linux-amd64',
    darwin: 'https://github.com/weserv/cobalt/releases/latest/download/cobalt-darwin-amd64'
};

// Create binaries directory if it doesn't exist
if (!fs.existsSync(BINARIES_DIR)) {
    fs.mkdirSync(BINARIES_DIR);
}

// Download file
async function downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', err => {
            fs.unlink(outputPath, () => reject(err));
        });
    });
}

// Extract zip file
async function extractZip(zipPath, outputDir) {
    const { stdout } = await execAsync(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outputDir}' -Force"`);
    return stdout;
}

// Extract tar.xz file
async function extractTarXz(tarPath, outputDir) {
    const { stdout } = await execAsync(`tar -xf '${tarPath}' -C '${outputDir}'`);
    return stdout;
}

// Make file executable
async function makeExecutable(filePath) {
    const { stdout } = await execAsync(`chmod +x '${filePath}'`);
    return stdout;
}

// Download and setup yt-dlp
async function setupYtDlp() {
    console.log('Downloading yt-dlp...');
    const ytDlpPath = path.join(BINARIES_DIR, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
    await downloadFile(YT_DLP_URL, ytDlpPath);
    if (process.platform !== 'win32') {
        await makeExecutable(ytDlpPath);
    }
    console.log('yt-dlp setup complete');
}

// Download and setup FFmpeg
async function setupFfmpeg() {
    console.log('Downloading FFmpeg...');
    const ffmpegUrl = FFMPEG_URL[process.platform];
    const ffmpegZip = path.join(BINARIES_DIR, 'ffmpeg.zip');
    await downloadFile(ffmpegUrl, ffmpegZip);
    
    const ffmpegDir = path.join(BINARIES_DIR, 'ffmpeg');
    if (!fs.existsSync(ffmpegDir)) {
        fs.mkdirSync(ffmpegDir);
    }
    
    if (process.platform === 'win32') {
        await extractZip(ffmpegZip, ffmpegDir);
        // Move ffmpeg.exe to binaries directory
        const ffmpegExe = path.join(ffmpegDir, 'ffmpeg-master-latest-win64-gpl', 'bin', 'ffmpeg.exe');
        fs.renameSync(ffmpegExe, path.join(BINARIES_DIR, 'ffmpeg.exe'));
    } else {
        await extractTarXz(ffmpegZip, ffmpegDir);
        // Move ffmpeg binary to binaries directory
        const ffmpegBin = path.join(ffmpegDir, 'ffmpeg');
        fs.renameSync(ffmpegBin, path.join(BINARIES_DIR, 'ffmpeg'));
        await makeExecutable(path.join(BINARIES_DIR, 'ffmpeg'));
    }
    
    // Clean up
    fs.unlinkSync(ffmpegZip);
    console.log('FFmpeg setup complete');
}

// Download and setup Cobalt
async function setupCobalt() {
    console.log('Downloading Cobalt...');
    const cobaltUrl = COBALT_URL[process.platform];
    const cobaltPath = path.join(BINARIES_DIR, process.platform === 'win32' ? 'cobalt.exe' : 'cobalt');
    await downloadFile(cobaltUrl, cobaltPath);
    if (process.platform !== 'win32') {
        await makeExecutable(cobaltPath);
    }
    console.log('Cobalt setup complete');
}

// Main setup function
async function setup() {
    try {
        await setupYtDlp();
        await setupFfmpeg();
        await setupCobalt();
        console.log('All binaries setup complete!');
    } catch (error) {
        console.error('Error setting up binaries:', error);
        process.exit(1);
    }
}

// Run setup
setup(); 