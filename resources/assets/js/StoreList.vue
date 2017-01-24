<template>
  <div id="myApp">
    <ul id="example-1">
      <li v-for="item in storeinfo" track-by="$index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },

    props: {
      storeinfo: Array,
    }
  }
</script>