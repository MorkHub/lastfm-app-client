import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

import { EventBus } from './event-bus.js';
import { ScaleLoader } from 'vue-spinner/dist/vue-spinner.min.js'

import User from './User.vue';

Vue.component('ScaleLoader', ScaleLoader);

let app = new Vue({
  el: '#app',
  data: {

  },
  methods: {
    setBackgroundImage(url) {
      console.log(url['#text'])
      document.body.style.backgroundImage = `url(${url['#text']})`;
    }
  },
	ready: function() {

	},
  components: { User }
});

EventBus.$on('backgroundImageChange', (url) => {
  app.setBackgroundImage(url);
});
