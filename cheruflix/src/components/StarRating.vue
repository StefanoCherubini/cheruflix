<template>
    <div class="star-rating">
      <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(rating / 2) }">&#9733;</span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      rating: {
        type: Number,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .star-rating {
    display: inline-block;
    margin-left: 4px;
  }
  
  .star {
    font-size: 20px;
    color: #d3d3d3; /* colore stelle vuote */
  }
  
  .star.filled {
    color: #ffe920; /* colore stelle piene */
  }
  </style>