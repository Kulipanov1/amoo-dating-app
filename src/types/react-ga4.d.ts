declare module 'react-ga4' {
  interface EventOptions {
    [key: string]: any;
  }

  interface PageViewOptions {
    hitType: string;
    page: string;
  }

  interface ReactGA {
    initialize: (trackingId: string) => void;
    send: (options: PageViewOptions) => void;
    event: (options: { category: string; action: string } & EventOptions) => void;
    set: (options: { [key: string]: any }) => void;
  }

  const ReactGA: ReactGA;
  export default ReactGA;
} 