import Vue from 'vue';
import VueResource from 'vue-resource';

import User from './User.vue';

Vue.use(VueResource);

let app = new Vue({
  el: '#app',
  data: {

  },
  methods: {

  },
	ready: function() {

	},
  components: { User }
});
