# Universal Video Downloader

A powerful browser extension that allows you to download videos from over 1000 sites, including YouTube, Vimeo, Dailymotion, and many more. Built with modern web technologies and featuring a beautiful, user-friendly interface.

## Features

- Download videos from over 1000 sites
- Multiple quality options
- Audio-only download option
- Strip audio from videos
- Download subtitles
- Download thumbnails
- Download metadata
- Copy video URL and CDN URL
- Download queue management
- Progress tracking
- Cross-browser support (Chrome and Firefox)
- Modern UI with Tailwind CSS
- Native messaging host for secure communication

## Supported Sites

### Social Media
- YouTube
- Facebook
- Instagram
- Twitter
- TikTok
- Snapchat
- LinkedIn
- Reddit
- Tumblr
- Pinterest

### Video Platforms
- Vimeo
- Dailymotion
- Twitch
- Bilibili
- Niconico
- Rutube
- VK
- Bitchute
- Odysee
- Rumble

### Streaming Services
- Netflix
- Amazon Prime Video
- Disney+
- Hulu
- HBO Max
- Peacock
- Paramount+
- Crunchyroll
- Funimation
- VRV

### Educational
- Coursera
- Udemy
- Khan Academy
- edX
- LinkedIn Learning
- Skillshare
- MasterClass
- Pluralsight
- Codecademy
- Duolingo

### Adult Content
- OnlyFans
- PornHub
- XVideos
- XNXX
- RedTube
- Chaturbate
- MyFreeCams
- ManyVids
- Clips4Sale
- OnlyFans

### Music
- SoundCloud
- Spotify
- Apple Music
- Deezer
- Tidal
- Bandcamp
- Mixcloud
- Last.fm
- Pandora
- iHeartRadio

### Sports
- ESPN
- Fox Sports
- NBC Sports
- CBS Sports
- DAZN
- FuboTV
- Sling TV
- YouTube TV
- Hulu Live TV
- AT&T TV

### News
- CNN
- BBC
- Fox News
- MSNBC
- Reuters
- Associated Press
- Al Jazeera
- The Guardian
- The New York Times
- The Washington Post

### Gaming
- Twitch
- YouTube Gaming
- Steam
- Epic Games
- GOG
- itch.io
- Roblox
- Minecraft
- Fortnite
- League of Legends

## Requirements

- Node.js >= 14.0.0
- Python >= 3.7
- Chrome or Firefox browser
- Windows, macOS, or Linux operating system

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/universal-video-downloader.git
   cd universal-video-downloader
   ```

2. Install dependencies and set up the extension:
   ```bash
   npm run setup
   ```
   This will:
   - Install npm dependencies
   - Download required binaries (yt-dlp, FFmpeg, Cobalt)
   - Install the native messaging host

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in your browser:

   **Chrome:**
   1. Open Chrome and go to `chrome://extensions/`
   2. Enable "Developer mode" in the top right
   3. Click "Load unpacked" and select the `dist` directory

   **Firefox:**
   1. Open Firefox and go to `about:debugging`
   2. Click "This Firefox" in the left sidebar
   3. Click "Load Temporary Add-on" and select the `manifest.json` file in the `dist` directory

## Usage

1. Navigate to a supported video website
2. Click the extension icon in your browser toolbar
3. Select your desired download options:
   - Video quality
   - Audio codec
   - Additional options (subtitles, thumbnail, metadata)
4. Click "Download" to start the download
5. Monitor progress in the popup window
6. Find your downloaded files in the configured download directory

## Development

- Start development server:
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

- Run tests:
  ```bash
  npm test
  ```

- Lint code:
  ```bash
  npm run lint
  ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - A feature-rich command-line program to download videos from YouTube and other video sites
- [FFmpeg](https://ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video
- [Cobalt](https://github.com/weserv/cobalt) - A fast and lightweight video downloader
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Webpack](https://webpack.js.org/) - A static module bundler for modern JavaScript applications

## Support

If you encounter any issues or have questions, please:
1. Check the [FAQ](FAQ.md)
2. Search existing [issues](https://github.com/yourusername/universal-video-downloader/issues)
3. Create a new issue if needed

## Security

- The extension uses native messaging for secure communication with the download tools
- All downloads are performed locally on your machine
- No data is sent to external servers except for the video download itself
- The source code is open and can be audited

## Roadmap

- [ ] Add support for more video platforms
- [ ] Implement video format conversion
- [ ] Add batch download support
- [ ] Add download scheduling
- [ ] Implement download speed limiting
- [ ] Add proxy support
- [ ] Add video trimming
- [ ] Add playlist download support
- [ ] Add download history
- [ ] Add favorites/bookmarks
- [ ] Add download templates
- [ ] Add keyboard shortcuts
- [ ] Add dark mode
- [ ] Add internationalization
- [ ] Add automatic updates
- [ ] Add error reporting
- [ ] Add analytics
- [ ] Add premium features 