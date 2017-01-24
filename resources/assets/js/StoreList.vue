<template>
  <div id="myApp">
    <ul id="example-1">
      <li v-for="item in storeinfo" track-by="$index">
        <a href="/tesco?store_id={{item.string[0]}}">{{item.string[1]}}</a>
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