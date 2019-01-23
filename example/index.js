import Vue from 'vue'
import Router from 'vue-router'
import RoutePrefetch from '../src'

Vue.use(Router)
Vue.use(RoutePrefetch)

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
        <ul style="margin-top: 110vh;">
          <li>
            <router-link to="/page/4" prefetchFiles={['/foo']}>
              page 4
            </router-link>
          </li>
          <li>
            <router-link to="/page/5">page 5</router-link>
          </li>
          <li>
            <router-link to="/page/6">page 6</router-link>
          </li>
        </ul>
      </div>
    )
  }
}

const createPage = id => async () => {
  console.log(`fetching page ${id}`)
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
