// Native messaging host name
const HOST_NAME = 'com.universalvideodownloader';

// Download queue
let downloadQueue = [];
let isProcessing = false;

// Listen for messages from popup and content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'START_DOWNLOAD':
            handleDownload(message.data);
            break;
        case 'GET_QUEUE_STATUS':
            sendResponse({ queue: downloadQueue });
            break;
        case 'CANCEL_DOWNLOAD':
            cancelDownload(message.downloadId);
            break;
        default:
            console.warn('Unknown message type:', message.type);
    }
    return true;
});

// Handle download request
async function handleDownload(data) {
    const { format, codec, options } = data;
    
    // Get current tab info
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    // Get video info from content script
    const videoInfo = await browser.tabs.sendMessage(currentTab.id, { type: 'GET_VIDEO_INFO' });
    
    if (!videoInfo) {
        showNotification('No video found on this page', 'error');
        return;
    }
    
    // Add to queue
    const downloadId = Date.now().toString();
    downloadQueue.push({
        id: downloadId,
        url: currentTab.url,
        title: videoInfo.title,
        format,
        codec,
        options,
        status: 'queued'
    });
    
    // Process queue if not already processing
    if (!isProcessing) {
        processQueue();
    }
    
    // Update popup
    browser.runtime.sendMessage({ type: 'QUEUE_UPDATED', queue: downloadQueue });
}

// Process download queue
async function processQueue() {
    if (downloadQueue.length === 0) {
        isProcessing = false;
        return;
    }
    
    isProcessing = true;
    const download = downloadQueue[0];
    
    try {
        // Get settings
        const settings = await browser.storage.sync.get({
            downloadDir: '',
            filenameTemplate: '%(title)s_%(date)s.%(ext)s',
            downloadEngine: 'yt-dlp'
        });
        
        // Prepare download command
        const command = prepareDownloadCommand(download, settings);
        
        // Send command to native host
        const response = await sendNativeMessage(command);
        
        if (response.success) {
            // Update download status
            download.status = 'completed';
            downloadQueue.shift();
            
            // Show success notification
            showNotification('Download completed successfully!');
            
            // Process next download
            processQueue();
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('Download error:', error);
        download.status = 'failed';
        download.error = error.message;
        showNotification('Download failed: ' + error.message, 'error');
        processQueue();
    }
}

// Prepare download command
function prepareDownloadCommand(download, settings) {
    const { url, format, codec, options } = download;
    const { downloadDir, filenameTemplate, downloadEngine } = settings;
    
    let command = {
        engine: downloadEngine,
        url: url,
        output: `${downloadDir}/${filenameTemplate}`,
        format: format,
        codec: codec
    };
    
    // Add options
    if (options.stripAudio) {
        command.stripAudio = true;
    }
    if (options.downloadSubtitles) {
        command.subtitles = true;
    }
    if (options.downloadThumbnail) {
        command.thumbnail = true;
    }
    if (options.downloadMetadata) {
        command.metadata = true;
    }
    
    return command;
}

// Send message to native host
function sendNativeMessage(message) {
    return new Promise((resolve, reject) => {
        const port = browser.runtime.connectNative(HOST_NAME);
        
        port.onMessage.addListener((response) => {
            port.disconnect();
            resolve(response);
        });
        
        port.onDisconnect.addListener(() => {
            if (browser.runtime.lastError) {
                reject(new Error(browser.runtime.lastError.message));
            }
        });
        
        port.postMessage(message);
    });
}

// Cancel download
function cancelDownload(downloadId) {
    const index = downloadQueue.findIndex(d => d.id === downloadId);
    if (index !== -1) {
        downloadQueue.splice(index, 1);
        browser.runtime.sendMessage({ type: 'QUEUE_UPDATED', queue: downloadQueue });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    browser.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Universal Video Downloader',
        message: message
    });
}

// Listen for native host messages
browser.runtime.onConnectNative.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message.type === 'PROGRESS') {
            browser.runtime.sendMessage({
                type: 'DOWNLOAD_PROGRESS',
                progress: message.progress
            });
        }
    });
}); 