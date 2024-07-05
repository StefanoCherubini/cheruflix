<template>
    <div>
      <h1 style="padding: 20px 0 20px ; text-align: center">FILM</h1>
      <div>
        <ListFilm />
      </div>
    </div>
  </template>
  
  <script>
  import ListFilm from '../components/ListFilm.vue';
  
  export default {
    name: 'Home',
    components: {
      ListFilm,
    },
  };
  
  </script>
  
  