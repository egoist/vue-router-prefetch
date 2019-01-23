const supported = typeof window !== 'undefined' && window.IntersectionObserver

export default (Vue, { componentName = 'RouterLink' } = {}) => {
  const observer =
    supported &&
    new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target._linkPrefetch()
        }
      })
    })

  const RouterLink = Vue.component('RouterLink')

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
      }
    },
    mounted() {
      const canPrefetch =
        !navigator.connection ||
        navigator.connection.effectiveType.indexOf('2g') === -1
      if (this.prefetch && observer && canPrefetch) {
        setTimeout(() => {
          this.observe()
        }, 1000)
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
        const components = this.getComponents()
        for (const Component of components) {
          this.$emit('prefetch', this.to)
          Component() // eslint-disable-line new-cap
          Component._prefetched = true
          this.unobserve()
        }
      }
    }
  }

  Vue.component(Link.name, Link)
}
