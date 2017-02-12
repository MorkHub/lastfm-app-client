import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

import { ScaleLoader } from 'vue-spinner/dist/vue-spinner.min.js'

import User from './User.vue';

Vue.component('ScaleLoader', ScaleLoader);

let app = new Vue({
  el: '#app',
  data: {

  },
  methods: {
    setBackgroundImage(url) {

    }
  },
	ready: function() {

	},
  components: { User }
});
