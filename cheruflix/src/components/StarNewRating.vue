<template>
    <div class="star-Newrating">
      <span
        v-for="n in stars"
        :key="n"
        class="star"
        :class="{ 'star-filled': n <= hoverValue || n <= rating }"
        @mouseover="setHover(n)"
        @mouseleave="clearHover"
        @click="setRating(n)"
      >
        ★
      </span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      rating: {
        type: Number,
        required: true
      },
      stars: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        hoverValue: 0
      };
    },
    methods: {
      setHover(value) {
        this.hoverValue = value;
      },
      clearHover() {
        this.hoverValue = 0;
      },
      setRating(value) {
        this.$emit('update:rating', value);
      }
    }
  };
  </script>
  
  <style>
  .star-Newrating {
    display: flex;
  }
  .star {
    font-size: 2rem;
    cursor: pointer;
    color: #bfbfbf; /* colore stelle vuote */
  }
  .star-filled {
    color: #ffe920; /* colore stelle piene */
  }
  </style>
  