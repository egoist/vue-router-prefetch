declare module 'vue-router-prefetch' {
  export interface RouterPrefetchOptions {
    componentName?: string
    prefetch?: boolean
  }

  const install: (
    app: import('vue').App,
    options?: RouterPrefetchOptions
  ) => void

  export default install
}
