# EditorJS Video Plugin

A customizable video block plugin for Editor.js that supports YouTube, Vimeo, and other video platforms.

## Features

- 🎥 Built-in support for YouTube and Vimeo
- 🔌 Extensible platform support - add your own video platforms
- 📋 URL paste handling
- 🔄 Real-time preview
- ⚙️ Customizable embed options:
  - Fullscreen control
  - Clipboard access
  - Gyroscope functionality
- 📱 Responsive design
- 🔒 Sanitization support
- 📖 Read-only mode support

## Installation

### NPM

```bash
npm install @hannal/editorjs-video-plugin
```

### Browser

You can include the plugin directly in your HTML file:

```html
<!-- Include Editor.js -->
<script src="https://cdn.jsdelivr.net/npm/@hannal/editorjs@latest"></script>

<!-- Include the Video Plugin -->
<script src="https://cdn.jsdelivr.net/npm/@hannal/editorjs-video-plugin@latest"></script>

<script>
  const editor = new EditorJS({
    tools: {
      video: {
        class: VideoPlugin.Video,
        config: {
          // Optional platform configurations
        }
      }
    }
  });
</script>
```

Or use it via CDN in an ES module:

```html
<script type="module">
  import { Video, videoParser } from 'https://cdn.jsdelivr.net/npm/@hannal/editorjs-video-plugin@latest/src/index.js';
  
  const editor = new EditorJS({
    tools: {
      video: Video
    }
  });
</script>
```

## Usage

Add the Video tool to your Editor.js configuration:

```javascript
import { Video, videoParser } from '@hannal/editorjs-video-plugin';

const editor = new EditorJS({
  tools: {
    video: {
      class: Video,
      config: {
        // Optional platform configurations
      }
    }
  }
});
```

### Basic Example

```javascript
const editor = new EditorJS({
  tools: {
    video: Video
  }
});
```

### Data Format

The tool saves data in the following format:

```javascript
{
  url: 'https://www.youtube.com/watch?v=example',
  videoId: 'example',
  provider: 'youtube',
  fullscreen: true,
  clipboard: true,
  gyroscope: true
}
```

## Adding Custom Video Platforms

You can add support for additional video platforms by providing a platforms configuration:

```javascript
const editor = new EditorJS({
  tools: {
    video: {
      class: Video,
      config: {
        platforms: {
          dailymotion: {
            regex: /^.+dailymotion.com\/(?:video|embed)\/([^/?]+)/,
            embedUrl: (videoId) => `https://www.dailymotion.com/embed/video/${videoId}`,
            validate: (match) => match && match[1],
            getId: (match) => match[1]
          }
        }
      }
    }
  }
});
```

### Platform Configuration Options

Each platform configuration requires:

| Property | Type | Description |
|----------|------|-------------|
| regex | RegExp | Regular expression to match the video URL |
| embedUrl | Function | Function that returns the embed URL for a video ID |
| validate | Function | Function that validates the regex match |
| getId | Function | Function that extracts the video ID from the regex match |

### Example: Adding Dailymotion Support

```javascript
const dailymotionConfig = {
  dailymotion: {
    // Matches URLs like: https://www.dailymotion.com/video/x7tgd2g
    regex: /^.+dailymotion.com\/(?:video|embed)\/([^/?]+)/,
    embedUrl: (videoId) => `https://www.dailymotion.com/embed/video/${videoId}`,
    validate: (match) => match && match[1],
    getId: (match) => match[1]
  }
}
```

## HTML Rendering

To render the saved data as HTML, use the provided parser:

```javascript
import { videoParser } from '@hannal/editorjs-video-plugin';

const html = videoParser.video(blockData);
```

## Configuration Options

The video block supports the following embed options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fullscreen | boolean | true | Allows fullscreen mode |
| clipboard | boolean | true | Enables clipboard access |
| gyroscope | boolean | true | Enables gyroscope functionality |

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the package: `npm run build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Hannal (kay@hannal.net)