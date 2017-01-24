<template>
  <div id="myApp">
    <v-select 
      :options="storeinfo">
    </v-select>
  </div>
</template>
<script>
import vSelect from "vue-select"
  export default {
    components: { vSelect },

    data() {
      return {}
    },

    props: {
      storeinfo: Array,
    }
  }
</script>