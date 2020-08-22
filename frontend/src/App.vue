<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './assets/styles/animate.min.css';

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#noty_layout__bottomCenter {
  bottom: 5px;

  p {
    margin: 0.2em 0px 0px 0px;
  }
  pre {
    margin: 0.5em 0px 0px 0px
  }
}

@keyframes pulse2 {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.15, 1.15, 1.15);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.pulse2 {
  animation-name: pulse2;
  animation-timing-function: ease-in-out;
}

.animate__pulse2 {
    animation-name: pulse2;
    -webkit-animation-name: pulse2;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
}

</style>
