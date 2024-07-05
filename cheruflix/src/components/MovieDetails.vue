<template>

<div v-show="spinner" style="margin-top: 40px">
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
       </div>
    </div>
    <div style="height: 800px;">
    </div>
</div>


  <div v-if="movie" class="mx-auto details-general" style="margin-top: 20px">
    <div class="row">

    <div class="col" style="margin-top: 20px;">
      <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Movie Poster" class="img-MovieDetails">
      <h3 style="margin-top: 20px;">{{ texts.newRating }}</h3>
         <form @submit.prevent="submitRating">
          <div class="form-group">
            <label for="userRating">{{ texts.RatingLabel }}</label>
            <div class="row ">
              <div class="col">
                <star-new-rating v-model:rating="userRating" :stars="5"> </star-new-rating>
              </div>
              <div class="col-7">
              <button type="submit" class="btn btn-primary btn-rating">{{ texts.invia }}</button>
            </div>
          </div>
        </div>
     </form>
    </div>
      <div class="col-8 poppins-regular text-MovieDetails">
        <h1 class="text-center">{{ movie.title }}</h1>
        <h3>{{ texts.overview }}</h3>
        <p>{{ movie.overview }}</p>
       <h3>{{ texts.releaseDate }}</h3> 
        <p>{{ movie.release_date }}</p>
        <h3>{{ texts.spokenLanguage }}</h3> 
        <p>
          <span v-for="(language, i) in movie.spoken_languages" :key="i">{{ language.english_name }}<span v-if="i < movie.spoken_languages.length - 1">, </span></span>
        </p>

        <h3>{{ texts.rating }}</h3> 
        <starRating :rating="movie.vote_average" :stars="5"></starRating>
        <h3>{{ texts.genre }}</h3>
        <p>
          <span v-for="(genre, index) in movie.genres" :key="index">
            {{ genre.name }}
            <span v-if="index !== movie.genres.length - 1">, </span>
          </span>
        </p>
        <h3>{{ texts.budget }}</h3> 
        <p>{{ format(movie.budget) }} $</p>
        <h3>{{ texts.runtime }}</h3> 
        <p>{{ movie.runtime }} min</p>  
        <h3>{{ texts.revenue }}</h3> 
        <p>{{ format(movie.revenue) }} $</p>
      </div>
    </div>

    <div style="margin-top: -100px;">
      <h3 style="margin-left: 100px;">   {{ texts.cast }}</h3>
          <swiper :slides-per-view="7" :space-between="4" @reachEnd="fetchMovieCast" :scrollbar="{ hide: true, draggable: true }" :modules="modules" style="width: 80%;">
          <swiper-slide v-for="actor in cast" :key="actor.id">
            <div class="card">
              <img :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`" alt="Actor Photo" class="img-cast">
              <div class="card-body">
                <h5 class="card-title">{{ actor.name }}</h5>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        </div>
  </div>
</template>

<script>
import StarNewRating from './StarNewRating.vue';
import starRating from './StarRating.vue';

import { mapState } from 'vuex';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/scrollbar';

// Import moduli richiesti 
import { Scrollbar } from 'swiper/modules';


export default {
  components: { StarNewRating, starRating, Swiper, SwiperSlide },

  setup() {
    const modules = [Scrollbar];
    return{
      modules
    }
  },
  data() {
    return {
      movie: null,
      cast: [],
      userRating: 0,
      spinner: false,
    };
  },
  computed: {
    ...mapState({
      texts: state => state.texts.movieDetails
    }),
    language() {
      return this.$store.state.currentLanguage;
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.fetchMovieDetails(newId);
        this.fetchMovieCast(newId);
        window.scrollTo(0, 0); // Scorrere in cima quando la rotta cambia
      }
    },
    language: 'fetchMovieDetails'
  },
  methods: {
    async fetchMovieDetails() {
      this.spinner = true;

      const movieId = this.$route.params.id;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        }
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=${this.$store.state.currentLanguage}`, options);
        const data = await response.json();
        this.movie = data;
        this.spinner = false;
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del film:', error);
      }
    },

    async fetchMovieCast() {
      const movieId = this.$route.params.id;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        }
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, options);
        if (!response.ok) {
          throw new Error(`Errore nella chiamata API: ${response.statusText}`);
        }
        const data = await response.json();
        this.cast = data.cast;
      } catch (error) {
        console.error('Errore nel recupero del cast del film:', error);
      }
    },

    async submitRating() {
      const movieId = this.$route.params.id;
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        },
        body: JSON.stringify({ value: this.userRating })
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating`, options);
        const data = await response.json();
        alert('Valutazione inviata', data);
      } catch (error) {
        console.error('Errore nell\'invio della valutazione:', error);
      }
    },

    format(index) {
      // Funzione per formattare il budget con i punti ogni 3 cifre
      return index.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

   
  }
};
</script>
