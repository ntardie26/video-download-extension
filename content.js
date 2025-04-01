// Video patterns for different platforms
const VIDEO_PATTERNS = {
    youtube: {
        pattern: /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^&]+)/,
        selectors: {
            title: 'h1.title',
            author: '#owner-name a',
            views: '#count .view-count',
            date: '#info-strings yt-formatted-string',
            thumbnail: '#thumbnail img'
        }
    },
    vimeo: {
        pattern: /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/,
        selectors: {
            title: 'h1',
            author: '.clip_info-user-link',
            views: '.view-count',
            date: '.date',
            thumbnail: '.clip_info-thumbnail img'
        }
    },
    dailymotion: {
        pattern: /^https?:\/\/(?:www\.)?dailymotion\.com\/video\/([^\/]+)/,
        selectors: {
            title: '.dmp_Header-title',
            author: '.dmp_Header-channel-name',
            views: '.dmp_Header-views',
            date: '.dmp_Header-date',
            thumbnail: '.dmp_Header-poster img'
        }
    }
};

// Listen for messages from popup and background scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'GET_VIDEO_INFO':
            sendResponse(getVideoInfo());
            break;
        case 'GET_CDN_URL':
            sendResponse(getCdnUrl());
            break;
        default:
            console.warn('Unknown message type:', message.type);
    }
    return true;
});

// Get video information
function getVideoInfo() {
    const url = window.location.href;
    const platform = detectPlatform(url);
    
    if (!platform) {
        return null;
    }
    
    const selectors = VIDEO_PATTERNS[platform].selectors;
    
    return {
        platform,
        title: getTextContent(selectors.title),
        author: getTextContent(selectors.author),
        views: parseViews(getTextContent(selectors.views)),
        date: getTextContent(selectors.date),
        thumbnail: getImageUrl(selectors.thumbnail),
        url: url
    };
}

// Get CDN URL
function getCdnUrl() {
    const videoElement = document.querySelector('video');
    if (videoElement && videoElement.src) {
        return { cdnUrl: videoElement.src };
    }
    return { cdnUrl: null };
}

// Detect platform from URL
function detectPlatform(url) {
    for (const [platform, { pattern }] of Object.entries(VIDEO_PATTERNS)) {
        if (pattern.test(url)) {
            return platform;
        }
    }
    return null;
}

// Get text content from selector
function getTextContent(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : '';
}

// Get image URL from selector
function getImageUrl(selector) {
    const element = document.querySelector(selector);
    return element ? element.src : '';
}

// Parse views count
function parseViews(views) {
    if (!views) return 0;
    
    const match = views.match(/(\d+(?:,\d+)*)/);
    if (!match) return 0;
    
    return parseInt(match[1].replace(/,/g, ''));
}

// Watch for video element changes
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                browser.runtime.sendMessage({
                    type: 'VIDEO_DETECTED',
                    info: getVideoInfo()
                });
            }
        }
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
}); 