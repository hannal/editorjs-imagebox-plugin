import './styles.css';

class ImageBox {
  static get toolbox() {
    return {
      title: 'ImageBox',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-42-30-56 29-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor({data, api, readOnly}) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      url: data.url || '',
      caption: data.caption || '',
      alt: data.alt || '',
      withBorder: data.withBorder !== undefined ? data.withBorder : false,
      withLink: data.withLink || '',
      stretched: data.stretched !== undefined ? data.stretched : false,
    };

    this.nodes = {
      wrapper: null,
      imageContainer: null,
      imageEl: null,
      caption: null,
    };

    // BlockTune 메서드들을 인스턴스에 바인딩
    this.tunes = [
      {
        name: 'withBorder',
        icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.1v3.373H1.9zm0 2.137h2.2v3.374h8.4v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.422zm15.9-2.137H15.6V5.082h-4.2V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>',
        label: 'Add border',
        toggle: true,
        isActive: this.data.withBorder,
        onClick: () => this._toggleBorder()
      },
      {
        name: 'stretched',
        icon: '<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>',
        label: 'Stretch image',
        toggle: true,
        isActive: this.data.stretched,
        onClick: () => this._toggleStretched()
      }
    ];
  }

  render() {
    this.nodes.wrapper = document.createElement('div');
    this.nodes.wrapper.classList.add('image-tool');

    if (this.data.url) {
      this._createImage(this.data.url);
    } else {
      this._showUrlInput();
    }

    return this.nodes.wrapper;
  }

  _createImage(url) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-tool__image');
    
    const image = document.createElement('img');
    image.src = url;
    image.alt = this.data.alt;
    
    if (this.data.withBorder) {
      imageContainer.classList.add('image-tool__image--bordered');
    }
    
    if (!this.data.stretched) {
      imageContainer.classList.add('image-tool__image--width-80');
    }

    if (this.data.withLink) {
      const link = document.createElement('a');
      link.href = this.data.withLink;
      link.target = '_blank';
      link.appendChild(image);
      imageContainer.appendChild(link);
    } else {
      imageContainer.appendChild(image);
    }

    const inputsWrapper = document.createElement('div');
    inputsWrapper.classList.add('image-tool__inputs');

    // Alt text input
    const altInput = document.createElement('input');
    altInput.type = 'text';
    altInput.placeholder = 'Alt text';
    altInput.value = this.data.alt;
    altInput.addEventListener('change', (e) => {
      this.data.alt = e.target.value;
      image.alt = e.target.value;
    });
    inputsWrapper.appendChild(altInput);

    // Link input
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.placeholder = 'Link URL';
    linkInput.value = this.data.withLink;
    linkInput.addEventListener('change', (e) => {
      this.data.withLink = e.target.value;
      this._updateLink(e.target.value);
    });
    inputsWrapper.appendChild(linkInput);

    const caption = document.createElement('div');
    caption.classList.add('image-tool__caption');
    caption.contentEditable = !this.readOnly;
    caption.innerHTML = this.data.caption || '';

    this.nodes.imageContainer = imageContainer;
    this.nodes.imageEl = image;
    this.nodes.caption = caption;

    this.nodes.wrapper.innerHTML = '';
    this.nodes.wrapper.appendChild(imageContainer);
    this.nodes.wrapper.appendChild(inputsWrapper);
    this.nodes.wrapper.appendChild(caption);
  }

  _showUrlInput() {
    const urlContainer = document.createElement('div');
    urlContainer.classList.add('image-tool__url-container');

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Paste image URL';
    urlInput.classList.add('image-tool__url-input');

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = 'Add Image';
    addButton.classList.add('image-tool__button');

    urlContainer.appendChild(urlInput);
    urlContainer.appendChild(addButton);

    this.nodes.wrapper.appendChild(urlContainer);

    addButton.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (url) {
        this.data.url = url;
        this._createImage(url);
      }
    });

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const url = urlInput.value.trim();
        if (url) {
          this.data.url = url;
          this._createImage(url);
        }
      }
    });
  }

  save() {
    return {
      url: this.data.url,
      caption: this.nodes.caption ? this.nodes.caption.innerHTML : '',
      alt: this.data.alt,
      withBorder: this.data.withBorder,
      withLink: this.data.withLink,
      stretched: this.data.stretched,
    };
  }

  validate(data) {
    return data.url.trim() !== '';
  }

  _toggleBorder() {
    const { imageContainer } = this.nodes;
    
    this.data.withBorder = !this.data.withBorder;
    imageContainer.classList.toggle('image-tool__image--bordered');
  }

  _toggleStretched() {
    const { imageContainer } = this.nodes;
    
    this.data.stretched = !this.data.stretched;
    imageContainer.classList.toggle('image-tool__image--width-80');
  }

  _updateLink(url) {
    const { imageContainer, imageEl } = this.nodes;
    
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.appendChild(imageEl.cloneNode(true));
      imageContainer.innerHTML = '';
      imageContainer.appendChild(link);
    } else {
      imageContainer.innerHTML = '';
      imageContainer.appendChild(imageEl);
    }
  }

  renderSettings() {
    // 각 tune의 HTML 요소를 반환
    return this.tunes.map((tune) => ({
      icon: tune.icon,
      label: tune.label,
      isActive: tune.isActive,
      closeOnActivate: false,
      onActivate: () => {
        tune.onClick();
        // isActive 상태 업데이트
        tune.isActive = !tune.isActive;
        return false;
      }
    }));
  }
}


const imageBoxParser = {
  imageBox: (block) => {
    const data = block.data;
    
    let imageClasses = ['imagebox'];
    if (data.withBorder) imageClasses.push('imagebox--with-border');
    if (!data.stretched) imageClasses.push('imagebox--width-80');

    let imageHtml = `<img src="${data.url}" alt="${data.alt || ''}" class="${imageClasses.join(' ')}" />`;
    
    if (data.withLink) {
      imageHtml = `<a href="${data.withLink}" target="_blank" rel="noopener">${imageHtml}</a>`;
    }

    const caption = data.caption ? `<figcaption>${data.caption}</figcaption>` : '';
    
    return `<figure class="imagebox-wrapper">${imageHtml}${caption}</figure>`;
  }
};

export { ImageBox, imageBoxParser };