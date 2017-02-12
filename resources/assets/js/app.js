
  // Imports.
  import Vue from 'vue';
  import VueResource from 'vue-resource';

  // Vue Includes.
  Vue.use(VueResource);

  import { EventBus } from './event-bus.js';
  import { ScaleLoader } from 'vue-spinner/dist/vue-spinner.min.js'

  import AppComponent from './App.vue';
  import User from './User.vue';

  Vue.component('ScaleLoader', ScaleLoader);


  let App = new Vue({
    el: '#app',
    render: function (createElement) {
      return createElement(AppComponent)
    },
    data: {

    },
    methods: {
      setBackgroundImage(url) {
        document.body.style.backgroundImage = `url(${url['#text']})`;
      },
      getQueryString(field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
      }
    },
    ready: function() {
      console.log(this.$route.query.test);
    },
    components: { user : User }
  });

  // Events
  EventBus.$on('backgroundImageChange', (url) => {
    App.setBackgroundImage(url);
  });