<template>
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
        <router-link to="/page/4" :prefetchFiles="['/foo']">
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
</template>
