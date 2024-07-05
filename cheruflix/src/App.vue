<template>
  <Navbar />
  <router-view></router-view> 
  <Footer />
</template>

<script>
import { mapState } from 'vuex';
import Navbar from './views/Navbar.vue';
import Footer from './views/Footer.vue';

export default {
  components: {
    Navbar,Footer     
  },
  
  computed: {
    ...mapState({
      texts: state => state.texts,
      scritte: state => state.scritte
    })
  }
};
</script>


