class Video {
  static get toolbox() {
    return {
      title: 'Video',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 16.5l6-4.5-6-4.5v9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" fill="currentColor"/></svg>'
    };
  }

  constructor({ data, api, config = {} }) {
    this.data = {
      url: data.url || '',
      videoId: data.videoId || '',
      provider: data.provider || '',
      fullscreen: data.fullscreen !== undefined ? data.fullscreen : true,
      clipboard: data.clipboard !== undefined ? data.clipboard : true,
      gyroscope: data.gyroscope !== undefined ? data.gyroscope : true
    };
    this.api = api;
    this.wrapper = undefined;

    // Default video platforms configuration
    this.platforms = {
      youtube: {
        regex: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
        embedUrl: (videoId) => `https://www.youtube.com/embed/${videoId}`,
        validate: (match) => match && match[2].length === 11,
        getId: (match) => match[2]
      },
      vimeo: {
        regex: /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/,
        embedUrl: (videoId) => `https://player.vimeo.com/video/${videoId}`,
        validate: (match) => match && match[1],
        getId: (match) => match[1]
      },
      ...config.platforms // Merge custom platform configurations
    };
  }

  static get sanitize() {
    return {
      url: {},
      videoId: {},
      provider: {},
      fullscreen: {},
      clipboard: {},
      gyroscope: {}
    }
  }

  validate(savedData) {
    if (!savedData.url || !savedData.videoId || !savedData.provider) {
      return false;
    }
    return true;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return {
      patterns: {
        youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
        vimeo: /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([^&\s]+)/
      }
    }
  }

  onPaste(event) {
    const text = event.detail.data;
    const videoInfo = this._parseVideoUrl(text);
    
    if (videoInfo) {
      this.data = {
        ...this.data,
        url: text,
        videoId: videoInfo.videoId,
        provider: videoInfo.provider
      };
    }
  }

  _parseVideoUrl(url) {
    for (const [provider, platform] of Object.entries(this.platforms)) {
      const match = url.match(platform.regex);
      if (platform.validate(match)) {
        return {
          videoId: platform.getId(match),
          provider
        };
      }
    }
    return null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('video-wrapper');

    if (this.data.url) {
      this._createVideoPreview(this.data.url);
    }

    const input = document.createElement('input');
    input.placeholder = 'Enter video URL (YouTube or Vimeo)';
    input.value = this.data.url || '';
    input.classList.add('cdx-input');

    input.addEventListener('paste', (event) => {
      this._createVideoPreview(event.clipboardData.getData('text'));
    });

    input.addEventListener('change', (event) => {
      this._createVideoPreview(event.target.value);
    });

    this.wrapper.appendChild(input);

    const controls = document.createElement('div');
    controls.classList.add('video-controls');
    controls.style.marginTop = '10px';

    const options = [
      { id: 'fullscreen', label: 'Allow Fullscreen', checked: this.data.fullscreen },
      { id: 'clipboard', label: 'Allow Clipboard', checked: this.data.clipboard },
      { id: 'gyroscope', label: 'Allow Gyroscope', checked: this.data.gyroscope }
    ];

    options.forEach(option => {
      const label = document.createElement('label');
      label.style.marginRight = '15px';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = option.checked;
      checkbox.addEventListener('change', (e) => {
        this.data[option.id] = e.target.checked;
        if (this.data.url) {
          this._createVideoPreview(this.data.url);
        }
      });
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${option.label}`));
      controls.appendChild(label);
    });

    this.wrapper.appendChild(controls);
    return this.wrapper;
  }

  _createVideoPreview(url) {
    const videoInfo = this._parseVideoUrl(url);
    if (!videoInfo) {
      return;
    }

    this.data = {
      ...this.data,
      url: url,
      videoId: videoInfo.videoId,
      provider: videoInfo.provider
    };

    const previewContainer = this.wrapper.querySelector('.video-preview');
    if (previewContainer) {
      previewContainer.remove();
    }

    const preview = document.createElement('div');
    preview.classList.add('video-preview');
    preview.style.marginTop = '10px';
    preview.style.position = 'relative';
    preview.style.paddingBottom = '56.25%';
    preview.style.height = '0';
    preview.style.overflow = 'hidden';

    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';

    let allow = [];
    if (this.data.fullscreen) allow.push('fullscreen');
    if (this.data.clipboard) allow.push('clipboard-write');
    if (this.data.gyroscope) allow.push('gyroscope');
    iframe.allow = allow.join('; ');

    const platform = this.platforms[videoInfo.provider];
    if (platform) {
      iframe.src = platform.embedUrl(videoInfo.videoId);
    }

    preview.appendChild(iframe);
    this.wrapper.insertBefore(preview, this.wrapper.firstChild);
  }

  save(blockContent) {
    const videoInfo = this._parseVideoUrl(this.data.url);
    return {
      url: this.data.url,
      videoId: videoInfo?.videoId || this.data.videoId,
      provider: videoInfo?.provider || this.data.provider,
      fullscreen: this.data.fullscreen,
      clipboard: this.data.clipboard,
      gyroscope: this.data.gyroscope
    };
  }
}

const videoParser = {
  video: (block) => {
    if (!block.data.videoId) return '';

    const allow = [];
    if (block.data.fullscreen) allow.push('fullscreen');
    if (block.data.clipboard) allow.push('clipboard-write');
    if (block.data.gyroscope) allow.push('gyroscope');

    // Default platforms configuration for parser
    const platforms = {
      youtube: (videoId) => `https://www.youtube.com/embed/${videoId}`,
      vimeo: (videoId) => `https://player.vimeo.com/video/${videoId}`,
      ...block.config?.platforms
    };

    const embedUrl = platforms[block.data.provider]?.(block.data.videoId) || '';

    return `
      <div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="${embedUrl}"
          allow="${allow.join('; ')}"
          allowfullscreen
        ></iframe>
      </div>
    `;
  }
};

export { Video, videoParser };
