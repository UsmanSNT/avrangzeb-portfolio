declare module 'react-quill' {
  import { Component } from 'react';
  
  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    onFocus?: (range: any, source: string, editor: any) => void;
    onBlur?: (previousRange: any, source: string, editor: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    tabIndex?: number;
    preserveWhitespace?: boolean;
  }
  
  export default class ReactQuill extends Component<ReactQuillProps> {
    getEditor(): any;
    getEditingArea(): HTMLElement;
    focus(): void;
    blur(): void;
  }
}

