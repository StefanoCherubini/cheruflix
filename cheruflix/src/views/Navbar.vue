<template>
  <div>
    <nav class="navbar navbar-expand-lg " style="background-color: #f4f4f6;">
      <div class="container-fluid">
        <router-link to="/">
          <img
            alt="cheruflix logo"
            class="logo"
            src="../components/icons/logo cheruflix blu.png"
            width="140"
            height="60"
          />
        </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation"> 
                <span class="navbar-toggler-icon"></span>
            </button>
        <div class="collapse navbar-collapse" id="navbarScroll">
          <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px">
            <router-link to="/" class="poppins-regular">{{ texts.navbar.home }}</router-link>
            <router-link to="/Film" class="poppins-regular">{{ texts.navbar.movies }}</router-link>
            <router-link to="/SerieTV" class="poppins-regular">{{ texts.navbar.series }}</router-link>
          </ul>
        </div>
        <ul class="nav justify-content-end">
          <li class="nav-item dropdown">
            <button type="button" class="btn dropdown-toggle" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-translate"
                viewBox="0 0 16 16"
              >
                <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"></path>
                <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"></path>
              </svg>
            </button>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
              <li><a class="dropdown-item" href="#" @click="changeLanguage('en-US')">English</a></li>
              <li><a class="dropdown-item" href="#" @click="changeLanguage('it-IT')">Italiano</a></li>
              <li><a class="dropdown-item" href="#" @click="changeLanguage('es-ES')">Español</a></li>
            </ul>
          </li>
        </ul>
        <form class="d-flex" role="search" @submit.prevent="searchMoviesAndSeries">
          <input class="form-control me-2" type="search" :placeholder="texts.navbar.searchPlaceholder" aria-label="Search" v-model="query"/>
          <button class="btn btn-outline-primary" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg></button>
        </form>
      </div>
    </nav>

    <div v-if="searchResults.length > 0" style="padding: 0 200px 10px 200px;" id="carousel-search">
      <h2>{{ texts.searchResults.title }}</h2>
      <swiper :slides-per-view="6" :space-between="10" class="carousel-search-body"  :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="result in searchResults" :key="result.id">
          <router-link :to="getResultLink(result)">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${result.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto" />
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ result.title || result.name }}</h5>
                <star-rating :rating="result.vote_average"></star-rating>
                <p class="card-text poppins-regular">
                  {{ texts.movieCard.year }} : {{ result.release_date ? result.release_date.split('-')[0] : (result.first_air_date ? result.first_air_date.split('-')[0] : 'N/A') }}
                </p>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { mapState } from 'vuex';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

import StarRating from '../components/StarRating.vue'; 

export default {
  components: { Swiper, SwiperSlide, StarRating },
  computed: {
    ...mapState({
      texts: state => state.texts.seriesDetails
    }),
    language() {
      return this.$store.state.currentLanguage;
    }
  },
  setup() {
    const store = useStore();
    const texts = computed(() => store.getters.getTranslations);

    const query = ref('');
    const searchResults = ref([]);

    const searchMoviesAndSeries = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        },
      };

      try {
        const [movieResponse, seriesResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?query=${query.value}&language=${store.state.currentLanguage}`, options),
          fetch(`https://api.themoviedb.org/3/search/tv?query=${query.value}&language=${store.state.currentLanguage}`, options),
        ]);

        const movieData = await movieResponse.json();
        const seriesData = await seriesResponse.json();

        // Assicurati che le chiavi siano corrette
        const moviesWithMediaType = movieData.results.map(movie => ({ ...movie, media_type: 'movie' }));
        const seriesWithMediaType = seriesData.results.map(tvShow => ({ ...tvShow, media_type: 'series' }));

        searchResults.value = [...moviesWithMediaType, ...seriesWithMediaType];
      } catch (error) {
        console.error('Error during search:', error);
      }
    };

    const getResultLink = (result) => {
      if (result.media_type === 'movie') {
        return { name: 'MovieDetails', params: { id: result.id } }; // Navigazione per film
      } else if (result.media_type === 'series') {
        return { name: 'SeriesDetails', params: { id: result.id } }; // Navigazione per serie TV
      }
      return '#'; // Ritorna un valore valido in caso di media_type non riconosciuto
    };

    const changeLanguage = (language) => {
      store.dispatch('setLanguage', language);
    };

    return {
      texts,
      query,
      searchResults,
      searchMoviesAndSeries,
      changeLanguage,
      getResultLink,
      modules: [Scrollbar]
    };
  },
};
</script>
