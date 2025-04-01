// Popup functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    const videoInfo = document.getElementById('videoInfo');
    const thumbnail = document.getElementById('thumbnail');
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const views = document.getElementById('views');
    const date = document.getElementById('date');
    const progress = document.getElementById('progress');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const queue = document.getElementById('queue');
    const queueList = document.getElementById('queueList');
    const settingsModal = document.getElementById('settingsModal');

    // Get current tab info
    browser.tabs.query({ active: true, currentWindow: true })
        .then(tabs => {
            const currentTab = tabs[0];
            return browser.tabs.sendMessage(currentTab.id, { type: 'GET_VIDEO_INFO' });
        })
        .then(videoInfo => {
            if (videoInfo) {
                displayVideoInfo(videoInfo);
            }
        })
        .catch(error => {
            console.error('Error getting video info:', error);
        });

    // Event listeners
    document.getElementById('downloadBtn').addEventListener('click', startDownload);
    document.getElementById('queueBtn').addEventListener('click', toggleQueue);
    document.getElementById('copyUrlBtn').addEventListener('click', copyVideoUrl);
    document.getElementById('copyCdnBtn').addEventListener('click', copyCdnUrl);
    document.getElementById('settingsBtn').addEventListener('click', showSettings);
    document.getElementById('cancelSettings').addEventListener('click', hideSettings);
    document.getElementById('saveSettings').addEventListener('click', saveSettings);

    // Listen for download progress updates
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'DOWNLOAD_PROGRESS') {
            updateProgress(message.progress);
        } else if (message.type === 'DOWNLOAD_COMPLETE') {
            hideProgress();
            showNotification('Download completed successfully!');
        } else if (message.type === 'DOWNLOAD_ERROR') {
            hideProgress();
            showNotification('Download failed: ' + message.error, 'error');
        }
    });
});

// Display video information
function displayVideoInfo(info) {
    const videoInfo = document.getElementById('videoInfo');
    videoInfo.classList.remove('hidden');

    document.getElementById('thumbnail').src = info.thumbnail;
    document.getElementById('title').textContent = info.title;
    document.getElementById('author').textContent = info.author;
    document.getElementById('views').textContent = formatNumber(info.views);
    document.getElementById('date').textContent = formatDate(info.date);
}

// Start download
async function startDownload() {
    const format = document.getElementById('format').value;
    const codec = document.getElementById('codec').value;
    const options = {
        stripAudio: document.getElementById('stripAudio').checked,
        downloadSubtitles: document.getElementById('downloadSubtitles').checked,
        downloadThumbnail: document.getElementById('downloadThumbnail').checked,
        downloadMetadata: document.getElementById('downloadMetadata').checked
    };

    showProgress();
    browser.runtime.sendMessage({
        type: 'START_DOWNLOAD',
        data: { format, codec, options }
    });
}

// Toggle queue visibility
function toggleQueue() {
    const queue = document.getElementById('queue');
    queue.classList.toggle('hidden');
    if (!queue.classList.contains('hidden')) {
        updateQueueList();
    }
}

// Update queue list
async function updateQueueList() {
    const response = await browser.runtime.sendMessage({ type: 'GET_QUEUE_STATUS' });
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';

    response.queue.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
        div.innerHTML = `
            <div class="flex-1">
                <div class="text-sm font-medium">${item.title}</div>
                <div class="text-xs text-gray-500">${item.format}</div>
            </div>
            <button class="text-red-500 hover:text-red-700" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        queueList.appendChild(div);
    });
}

// Copy video URL
async function copyVideoUrl() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const url = tabs[0].url;
    await navigator.clipboard.writeText(url);
    showNotification('URL copied to clipboard!');
}

// Copy CDN URL
async function copyCdnUrl() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const response = await browser.tabs.sendMessage(tabs[0].id, { type: 'GET_CDN_URL' });
    if (response.cdnUrl) {
        await navigator.clipboard.writeText(response.cdnUrl);
        showNotification('CDN URL copied to clipboard!');
    }
}

// Show settings modal
function showSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
    loadSettings();
}

// Hide settings modal
function hideSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

// Load settings
async function loadSettings() {
    const settings = await browser.storage.sync.get({
        downloadDir: '',
        filenameTemplate: '%(title)s_%(date)s.%(ext)s',
        defaultFormat: 'best',
        downloadEngine: 'yt-dlp'
    });

    document.getElementById('downloadDir').value = settings.downloadDir;
    document.getElementById('filenameTemplate').value = settings.filenameTemplate;
    document.getElementById('defaultFormat').value = settings.defaultFormat;
    document.getElementById('downloadEngine').value = settings.downloadEngine;
}

// Save settings
async function saveSettings() {
    const settings = {
        downloadDir: document.getElementById('downloadDir').value,
        filenameTemplate: document.getElementById('filenameTemplate').value,
        defaultFormat: document.getElementById('defaultFormat').value,
        downloadEngine: document.getElementById('downloadEngine').value
    };

    await browser.storage.sync.set(settings);
    hideSettings();
    showNotification('Settings saved successfully!');
}

// Show progress
function showProgress() {
    document.getElementById('progress').classList.remove('hidden');
    updateProgress(0);
}

// Hide progress
function hideProgress() {
    document.getElementById('progress').classList.add('hidden');
}

// Update progress
function updateProgress(percent) {
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressPercent').textContent = `${percent}%`;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
} 