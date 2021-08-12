import prefetch from './prefetch'
import { canPrefetch, supportIntersectionObserver, inBrowser } from './utils'

function installRouterPrefetch(
  /** @type {import('vue').App} */
  app,
  { componentName = 'RouterLink', prefetch: enablePrefetch = true } = {}
) {
  const observer =
    supportIntersectionObserver &&
    new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target._linkPrefetch()
        }
      })
    })

  const requestIdleCallback =
    (inBrowser && window.requestIdleCallback) ||
    function(cb, { timeout = 1 }) {
      const start = Date.now()
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start))
          }
        })
      }, timeout)
    }

  const RouterLink = app.component('RouterLink') || app.component('router-link')

  if (process.env.NODE_ENV === 'development' && !RouterLink) {
    console.error(
      `[vue-router-prefetch] You need to call app.use(VueRouter) before this plugin!`
    )
  }

  const Link = {
    name: componentName,
    props: {
      ...RouterLink.props,
      prefetch: {
        type: Boolean,
        default: enablePrefetch
      },
      prefetchFiles: {
        type: Array
      },
      timeout: {
        type: Number,
        default: 2000
      }
    },
    setup(props, context) {
      return RouterLink.setup(props, context)
    },
    mounted() {
      if (this.prefetch && observer && canPrefetch) {
        requestIdleCallback(this.observe, { timeout: this.timeout })
      }
    },
    beforeUnmount() {
      this.unobserve()
    },
    methods: {
      observe() {
        observer.observe(this.$el)
        this.$el._linkPrefetch = this.linkPrefetch
        this._linkObserved = true
      },
      unobserve() {
        if (this._linkObserved) {
          observer.unobserve(this.$el)
        }
      },
      getRouteComponents(route) {
        return route.matched
          .map(record => {
            return Object.values(record.components)
          })
          .flat()
          .filter(Component => {
            return (
              Component.cid === undefined && typeof Component === 'function'
            )
          })
      },
      linkPrefetch() {
        const route = this.$router.resolve(this.to)

        if (route.meta.__prefetched) return

        route.meta.__prefetched = true

        if (route.meta.prefetch !== false) {
          // Prefetch route component
          const components = this.getRouteComponents(route)
          for (const Component of components) {
            this.$emit('prefetch', this.to)
            Component() // eslint-disable-line new-cap
          }
        }

        if (typeof route.meta.prefetch === 'function') {
          route.meta.prefetch(route)
        }

        // Prefetch addtional files
        const prefetchFiles = [
          ...(this.prefetchFiles || []),
          ...(route.meta.prefetchFiles || [])
        ]
        if (prefetchFiles.length > 0) {
          for (const file of prefetchFiles) {
            prefetch(file)
          }
        }

        this.unobserve()
      }
    }
  }

  // `app.component(Link.name, Link)` will emit a warning
  app._context.components[Link.name] = Link
}

export {
  prefetch,
  // Export as `install` to make `app.use(require('vue-router-prefetch'))` work
  installRouterPrefetch as install
}

export default installRouterPrefetch
