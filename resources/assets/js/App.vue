<template>
  <div class="container">
    <div class="section">
      <user :username='route.queryData.username'></user>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { EventBus } from './event-bus.js';

  var App = {
    data() {
      return {
        route: {
          queryData: {
            username: this.getQueryString('username')
          }
        }
      };
    },
    methods: {
      getQueryString(field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
      }
    },
  };

  export default Vue.component('app', App);
</script>