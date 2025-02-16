import { API, BlockTool, BlockToolData } from '@hannal/editorjs';

export interface VideoConfig {
  platforms?: {
    [key: string]: {
      regex: RegExp;
      embedUrl: (videoId: string) => string;
      validate: (match: RegExpMatchArray | null) => boolean;
      getId: (match: RegExpMatchArray) => string;
    };
  };
}

export interface VideoData extends BlockToolData {
  url: string;
  videoId: string;
  provider: string;
  fullscreen: boolean;
  clipboard: boolean;
  gyroscope: boolean;
}

export class Video implements BlockTool {
  constructor({ data, api, config }: {
    data: VideoData;
    api: API;
    config?: VideoConfig;
  });

  static get toolbox(): { title: string; icon: string };
  static get isReadOnlySupported(): boolean;
  static get sanitize(): {
    url: {};
    videoId: {};
    provider: {};
    fullscreen: {};
    clipboard: {};
    gyroscope: {};
  };
  static get pasteConfig(): {
    patterns: {
      youtube: RegExp;
      vimeo: RegExp;
    };
  };

  render(): HTMLElement;
  save(blockContent: HTMLElement): VideoData;
  validate(savedData: VideoData): boolean;
  onPaste(event: CustomEvent): void;
}

export interface VideoParser {
  video: (block: { data: VideoData; config?: VideoConfig }) => string;
}

export const videoParser: VideoParser; 