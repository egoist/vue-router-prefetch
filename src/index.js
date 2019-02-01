import prefetch from './prefetch'
import { canPrefetch, supportIntersectionObserver, inBrowser } from './utils'

function installRouterPrefetch(Vue, { componentName = 'RouterLink' } = {}) {
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
        default: true
      },
      prefetchFiles: {
        type: Array
      }
    },
    mounted() {
      if (this.prefetch && observer && canPrefetch) {
        requestIdleCallback(this.observe, { timeout: 1000 })
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
          return typeof Component === 'function' && !Component._prefetched
        })
      },
      linkPrefetch() {
        // Prefetch route component
        const components = this.getComponents()
        for (const Component of components) {
          this.$emit('prefetch', this.to)
          Component() // eslint-disable-line new-cap
          Component._prefetched = true
        }

        // Prefetch addtional files
        if (this.prefetchFiles) {
          for (const file of this.prefetchFiles) {
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
