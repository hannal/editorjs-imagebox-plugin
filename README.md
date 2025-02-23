# EditorJS ImageBox Plugin

A customizable image box plugin for Editor.js that supports image border, resizing, and link options.

## Features

- 🖼 Image display with URL
- 🎨 Built-in styling options:
  - Border toggle
  - Width adjustment (80% / 100%)
  - Link attachment
- 📝 Image metadata:
  - Alt text
  - Caption
- 📱 Responsive design
- 🔒 Read-only mode support
- 📖 TypeScript support

## Installation

### NPM

```bash
npm install @hannal/editorjs-imagebox-plugin
```

### Browser

You can include the plugin directly in your HTML file:

```html
<!-- Include the ImageBox Plugin -->
<script src="https://cdn.jsdelivr.net/npm/@hannal/editorjs-imagebox-plugin@latest/dist/imagebox.umd.js"></script>

<script>
  const editor = new EditorJS({
    tools: {
      imagebox: {
        class: ImageBox
      }
    }
  });
</script>
```

### ES Module

You can also use it as an ES module:

```html
<script type="module">
  import EditorJS from '@hannal/editorjs';
  import { ImageBox } from '@hannal/editorjs-imagebox-plugin';

  const editor = new EditorJS({
    tools: {
      imagebox: {
        class: ImageBox
      }
    }
  });
</script>
```

Or in your JavaScript files:

```javascript
import EditorJS from '@hannal/editorjs';
import { ImageBox, imageboxParser } from '@hannal/editorjs-imagebox-plugin';

const editor = new EditorJS({
  tools: {
    imagebox: ImageBox
  }
});
```

## Usage

Add the ImageBox tool to your Editor.js configuration:

```javascript
import { ImageBox, imageboxParser } from '@hannal/editorjs-imagebox-plugin';

const editor = new EditorJS({
  tools: {
    imagebox: {
      class: ImageBox
    }
  }
});
```

### Basic Example

```javascript
const editor = new EditorJS({
  tools: {
    imagebox: ImageBox
  }
});
```

### Data Format

The tool saves data in the following format:

```javascript
{
  type: 'imagebox',
  data: {
    url: 'https://example.com/image.jpg',
    caption: 'Image caption',
    alt: 'Alt text',
    withBorder: false,
    withLink: 'https://example.com',
    stretched: false
  }
}
```

## HTML Rendering

To render the saved data as HTML, use the provided parser:

```javascript
import edjsHTML from "editorjs-html";
import { imageboxParser } from "@hannal/editorjs-imagebox-plugin";
import "@hannal/editorjs-imagebox-plugin/src/parser.css";

const edjsParser = edjsHTML({
  imagebox: imageboxParser
});

const html = edjsParser.parse(editorData);
```

The parser generates semantic HTML with the following structure:

```html
<figure class="imagebox-wrapper">
  <img src="image-url.jpg" alt="Alt text" class="imagebox imagebox--with-border imagebox--width-80">
  <figcaption>Image caption</figcaption>
</figure>
```

### Parser CSS Classes

The parser uses the following CSS classes that you can customize:

- `imagebox-wrapper`: The container element
- `imagebox`: The image element
- `imagebox--with-border`: Added when border is enabled
- `imagebox--width-80`: Added when width is set to 80%

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