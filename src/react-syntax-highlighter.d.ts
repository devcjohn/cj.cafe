// Type declarations for react-syntax-highlighter deep imports.
// Needed because moduleResolution "bundler" can't resolve @types subpath declarations.
declare module 'react-syntax-highlighter/dist/esm/prism-light' {
  import { PrismLight } from 'react-syntax-highlighter'
  export default PrismLight
}
declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export { default as materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism/material-dark'
}
declare module 'react-syntax-highlighter/dist/esm/styles/prism/material-dark' {
  const style: { [key: string]: React.CSSProperties }
  export default style
}
declare module 'react-syntax-highlighter/dist/esm/languages/prism/*' {
  const language: any
  export default language
}
