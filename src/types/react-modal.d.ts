declare module 'react-modal' {
  import * as React from 'react';
  
  export interface Props {
    isOpen: boolean;
    onRequestClose?: () => void;
    contentLabel?: string;
    className?: string;
    overlayClassName?: string;
    style?: {
      content?: React.CSSProperties;
      overlay?: React.CSSProperties;
    };
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  declare const Modal: React.ComponentType<Props>;
  export default Modal;
}