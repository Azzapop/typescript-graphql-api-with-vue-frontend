export {};
declare global {
  interface Window {
    __app_store?: string;
  }
}

declare module '*.svg' {
  const src: string;
  export default src;
}
