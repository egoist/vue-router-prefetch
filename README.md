# vue-router-prefetch

[![NPM version](https://badgen.net/npm/v/vue-router-prefetch)](https://npmjs.com/package/vue-router-prefetch) [![NPM downloads](https://badgen.net/npm/dm/vue-router-prefetch)](https://npmjs.com/package/vue-router-prefetch) [![CircleCI](https://badgen.net/circleci/github/egoist/vue-router-prefetch/master)](https://circleci.com/gh/egoist/vue-router-prefetch/tree/master)

**Please consider [donating](https://www.patreon.com/egoist) to this project's author, [EGOIST](#author), to show your ❤️ and support.**

## Features

- Prefetch links when they are visible in viewport.
- You don't need to change your code base to make it work.
- Tiny-size.

## Install

```bash
yarn add vue-router-prefetch
```

## Usage

You need to use this plugin after `vue-router`:

```js
import Vue from 'vue'
import Router from 'vue-router'
import RouterPrefetch from 'vue-router-prefetch'

Vue.use(Router)
Vue.use(RouterPrefetch)
```

Then you can use `<router-link>` without any changes, when this component is visible in viewport, it will automatically prefetch the (async) route component.

**Check out the [live demo](https://stackblitz.com/edit/vue-nr9q5u).**

You can also register it as a new component instead of overriding `<router-link>`:

```js
Vue.use(RouterPrefetch, {
  componentName: 'QuickLink'
})
```

Now you can use it as `<quick-link>` in your app.

## Browser Support

- Without polyfills: Chrome, Firefox, Edge, Opera, Android Browser, Samsung Internet.
- With [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) ~6KB gzipped/minified: Safari, IE11

## Props

All [props](https://router.vuejs.org/api/#router-link-props) of `<router-link>` are still available, additional props are listed below.

### prefetch

- Type: `boolean`
- Default: `true`

Whether to prefetch the matched route component.

You can also set `meta.prefetch` on vue-router's `route` object to disable prefetching this route for all `<router-link>`s:

```js
new VueRouter({
  routes: [
    {
      path: '/some-async-page',
      meta: { prefetch: false },
      component: () => import('./async-page.vue')
    }
  ]
})
```

It's also possible to turn of prefetching globally:

```js
Vue.use(RouterPrefetch, {
  prefetch: false
})
```

### prefetchFiles

- Type: `string[]`
- Examples: `['/foo.css']`

A list of additional files to prefetch. By default we only prefetch the route component.

You can also set `meta.prefetchFiles` on vue-router's `route` object, it will be merged with the prop value:

```js
new VueRouter({
  routes: [
    {
      path: '/some-async-page',
      meta: { prefetchFiles: ['/foo.css'] },
      component: () => import('./async-page.vue')
    }
  ]
})
```

### timeout

- Type: `number`
- Default: `2000` (ms)

Timeout after which prefetching will occur.

## Credits

Inspired by [quicklink](https://github.com/GoogleChromeLabs/quicklink) and [`nuxt-link`](https://github.com/nuxt/nuxt.js/pull/4574/).

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**vue-router-prefetch** © EGOIST, Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/vue-router-prefetch/contributors)).

> [Website](https://egoist.sh) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@\_egoistlily](https://twitter.com/_egoistlily)
