import { BlockTool, BlockToolData, API, ToolConfig } from '@editorjs/editorjs';

export interface ImageBoxData extends BlockToolData {
  url: string;
  caption?: string;
  alt?: string;
  withBorder?: boolean;
  withLink?: string;
  stretched?: boolean;
}

export interface ImageBoxConfig extends ToolConfig {
  // 설정 옵션이 필요하다면 여기에 추가
}

export interface BlockTune {
  name: string;
  icon: string;
  label: string;
  toggle?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export default class ImageBox implements BlockTool {
  constructor(options: {
    data: ImageBoxData;
    config: ImageBoxConfig;
    api: API;
    readOnly: boolean;
  });

  static get toolbox(): {
    title: string;
    icon: string;
  };

  static get isReadOnlySupported(): boolean;

  render(): HTMLElement;

  renderSettings(): {
    icon: string;
    label: string;
    isActive: boolean;
    closeOnActivate: boolean;
    onActivate: () => boolean;
  }[];

  save(): ImageBoxData;

  validate(data: ImageBoxData): boolean;
}

export type ImageBoxParserData = {
  data: ImageBoxData;
};

export const imageboxParser: (block: ImageBoxParserData) => string; 