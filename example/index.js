import Vue from 'vue'
import Router from 'vue-router'
import RoutePrefetch from '../src'

Vue.use(Router)
Vue.use(RoutePrefetch)

window.pages = new Set()

const Nav = {
  render() {
    return (
      <div>
        <ul>
          <li>
            <router-link to="/page/1">page 1</router-link>
          </li>
          <li>
            <router-link to="/page/2">page 2</router-link>
          </li>
          <li>
            <router-link to="/page/3">page 3</router-link>
          </li>
        </ul>
        <ul style="margin-top: 110vh;" id="bottom">
          <li>
            <router-link to="/page/4" prefetchFiles={['/foo']}>
              page 4
            </router-link>
          </li>
          <li>
            <router-link to="/page/5">page 5</router-link>
          </li>
          <li>
            <router-link to="/async-page">async-page</router-link>
          </li>
          <li>
            <router-link to="/page/6">page 6</router-link>
          </li>
          <li>
            <router-link to="/page/1">page 1</router-link>
          </li>
        </ul>
      </div>
    )
  }
}

const createPage = id => async () => {
  console.log(`fetching page ${id}`)
  window.pages.add(id)
  return {
    render() {
      return (
        <div>
          <h1>page {id}</h1>
          <Nav />
        </div>
      )
    }
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      component: {
        render() {
          return (
            <div>
              <h1>hi</h1>
              <Nav />
            </div>
          )
        }
      }
    },
    {
      path: '/async-page',
      meta: {
        prefetch(route) {
          console.log(route)
        }
      },
      component: () =>
        import(/* webpackChunkName: "async-page" */ './async-page.vue')
    }
  ]
})

for (let i = 0; i < 6; i++) {
  router.addRoutes([
    {
      path: `/page/${i + 1}`,
      component: createPage(i + 1)
    }
  ])
}

new Vue({
  el: '#app',
  router,
  render: h => h('router-view')
})
