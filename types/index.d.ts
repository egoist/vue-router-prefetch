declare module 'vue-router-prefetch' {
  import { PluginFunction } from 'vue'

  export interface RouterPrefetchOptions {
    componentName?: string;
    prefetch?: boolean;
  }

  const install: PluginFunction<RouterPrefetchOptions>

  export default install
}
