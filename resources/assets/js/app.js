import Vue from 'vue';
import VueResource from 'vue-resource';

import StoreList from './StoreList.vue';

Vue.use(VueResource);


var app = new Vue({
  el: '#app',
  data: {
  	storeinfo: []
  },
  methods: {
  	fetchStoreInfo: function() {
		this.$http.get('https://themork.co.uk/tesco/?json').then((response) => {
			let parsed = JSON.parse(response.body)["dict"];
			
			parsed = parsed.map(function(x){
			   return x.string[1];
			});

			app.$data.storeinfo = parsed;
		}, (response) => {
			console.error(response);
		});  		
  	}
  },
	ready: function() {
    this.fetchStoreInfo();
	},
  components: { StoreList }
});
