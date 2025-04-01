# Simple Video Downloader

A minimalist browser extension to download videos from 1000+ sites.  

## Features

- Download videos from over 1000 sites
- Choose video quality and audio-only options
- Download subtitles, thumbnails, and metadata
- Manage download queue with progress tracking
- Cross-browser support (Chrome and Firefox)

## Requirements

- Node.js >= 14
- Python >= 3.7
- Chrome or Firefox
- Windows, macOS, or Linux

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/ntardie26/video-download-extension.git
   cd video-download-extension
   ```

2. Install dependencies and binaries:
   ```bash
   npm run setup
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension:
   - **Chrome:** Open `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `dist` folder.
   - **Firefox:** Open `about:debugging`, click "This Firefox", then "Load Temporary Add-on", and select `manifest.json` from the `dist` folder.

## Usage

1. Visit a supported video site.
2. Click the extension icon.
3. Choose your download options (quality, audio-only, subtitles, etc.).
4. Hit "Download" and monitor progress.
5. Files are saved in your chosen download directory.

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
- Lint:
  ```bash
  npm run lint
  ```

## License

This project is licensed under the GNU General Public License v3. See [LICENSE](LICENSE) for details.

## Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)
- [Cobalt](https://github.com/weserv/cobalt)
- [Tailwind CSS](https://tailwindcss.com/)
- [Webpack](https://webpack.js.org/)

## Support

For issues or questions, open an issue on [GitHub](https://github.com/video-download-extension/issues).  
