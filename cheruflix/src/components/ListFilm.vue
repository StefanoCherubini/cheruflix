<template>
  <div v-show="spinner" style="margin-top: 40px">
    <div style="height: 800px;">
    </div>
</div>

  <div class="mx-auto pagina">
    <!-- Film Categories -->
    <div v-for="category in categories" :key="category.id">
      <h2>{{ getCategoryName(category.id) }}</h2>

      <swiper v-if="category.id === 1 && recentMovies.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMoreRecentMovies" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="movie in recentMovies" :key="movie.id">
          <router-link :to="{ name: 'MovieDetails', params: { id: movie.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ movie.title }}</h5>
                <star-rating :rating="movie.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <swiper v-if="category.id === 2 && popularMovies.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMorePopularMovies" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="movie in popularMovies" :key="movie.id">
          <router-link :to="{ name: 'MovieDetails', params: { id: movie.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ movie.title }}</h5>
                <star-rating :rating="movie.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <swiper v-if="category.id === 3 && upComingMovie.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMoreUpComingMovies" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="movie in upComingMovie" :key="movie.id">
          <router-link :to="{ name: 'MovieDetails', params: { id: movie.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ movie.title }}</h5>
                <star-rating :rating="movie.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { mapState } from 'vuex';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

import StarRating from './StarRating.vue';

export default {
  name: 'YourComponent',
  components: { Swiper, SwiperSlide, StarRating },
  setup() {
    const store = useStore();

    const categories = computed(() => store.getters.getTranslations.navbar.categories.film);

    function getCategoryName(id) {
      const category = categories.value.find(cat => cat.id === id);
      return category ? category.name : '';
    }

    return {
      categories,
      getCategoryName,
      modules: [Scrollbar],
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

  data() {
    return {
      recentMovies: [],
      popularMovies: [],
      upComingMovie: [],
      recentMoviesPage: 1,
      popularMoviesPage: 11,
      upComingMoviesPage: 1,
      spinner: false,
      loadingRecentMovies: false,
      loadingPopularMovies: false,
      loadingUpComingMovies: false,
    };
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.fetchRecentMovies();
      this.fetchPopularMovies();
      this.fetchUpComingMovies();
    },
    async fetchData() {
      await Promise.all([
        this.fetchRecentMovies(),
        this.fetchPopularMovies(),
        this.fetchUpComingMovies(),
      ]);
    },
    async fetchRecentMovies() {
      if (this.loadingRecentMovies) return;
      this.loadingRecentMovies = true;
      this.spinner=true;
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=${this.$store.state.currentLanguage}&page=${this.recentMoviesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        },
        });
        const data = await response.json();
        this.recentMovies = [...this.recentMovies, ...data.results];
        this.recentMoviesPage++;
        this.spinner=false;

      } catch (error) {
        console.error('Errore nel recupero dei film recenti:', error);
      } finally {
        this.loadingRecentMovies = false;
      }
    },
    async fetchPopularMovies() {
      if (this.loadingPopularMovies) return;
      this.loadingPopularMovies = true;

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=${this.$store.state.currentLanguage}&page=${this.popularMoviesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        },
        });
        const data = await response.json();
        this.popularMovies = [...this.popularMovies, ...data.results];
        this.popularMoviesPage++;
      } catch (error) {
        console.error('Errore nel recupero dei film popolari:', error);
      } finally {
        this.loadingPopularMovies = false;
      }
    },
    async fetchUpComingMovies() {
      if (this.loadingUpComingMovies) return;
      this.loadingUpComingMovies = true;

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?language=${this.$store.state.currentLanguage}&page=${this.upComingMoviesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        },
        });
        const data = await response.json();
        this.upComingMovie = [...this.upComingMovie, ...data.results];
        this.upComingMoviesPage++;
      } catch (error) {
        console.error('Errore nel recupero dei film in arrivo:', error);
      } finally {
        this.loadingUpComingMovies = false;
      }
    },
    fetchMoreRecentMovies() {
      if (!this.loadingRecentMovies) {
        this.fetchRecentMovies();
      }
    },
    fetchMorePopularMovies() {
      if (!this.loadingPopularMovies) {
        this.fetchPopularMovies();
      }
    },
    fetchMoreUpComingMovies() {
      if (!this.loadingUpComingMovies) {
        this.fetchUpComingMovies();
      }
    },
  },
};
</script>
