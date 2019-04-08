import prefetch from './prefetch'
import { canPrefetch, supportIntersectionObserver, inBrowser } from './utils'

function installRouterPrefetch(
  Vue,
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
    function(cb) {
      const start = Date.now()
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start))
          }
        })
      }, 1)
    }

  const RouterLink = Vue.component('RouterLink') || Vue.component('router-link')

  if (process.env.NODE_ENV === 'development' && !RouterLink) {
    console.error(
      `[vue-router-prefetch] You need to call Vue.use(VueRouter) before this plugin!`
    )
  }

  const Link = {
    name: componentName,
    extends: RouterLink,
    props: {
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
    mounted() {
      if (this.prefetch && observer && canPrefetch) {
        requestIdleCallback(this.observe, { timeout: this.timeout })
      }
    },
    beforeDestory() {
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
      getComponents() {
        return this.$router.getMatchedComponents(this.to).filter(Component => {
          return typeof Component === 'function'
        })
      },
      linkPrefetch() {
        const { route } = this.$router.resolve(this.to)

        if (route.meta.__prefetched) return

        route.meta.__prefetched = true

        if (route.meta.prefetch !== false) {
          // Prefetch route component
          const components = this.getComponents()
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

  Vue.component(Link.name, Link)
}

export {
  prefetch,
  // Export as `install` to make `Vue.use(require('vue-router-prefetch'))` work
  installRouterPrefetch as install
}

export default installRouterPrefetch
