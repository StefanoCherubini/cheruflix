<template>
  <div v-show="spinner" style="margin-top: 40px">
    <div style="height: 800px;">
    </div>
  </div>

  <div class="mx-auto pagina">
    <div v-for="category in categories" :key="category.id">
      <h2 id="h2-titoli">{{ getCategoryName(category.id) }}</h2>
      
      <!-- Swiper components using translated category names -->
      <swiper v-if="category.id === 1 && recentMovies.length > 0" :slides-per-view="1" :space-between="0" @reachEnd="fetchMoreRecentMovies" :navigation="true" :modules="modules" style=" width: 90%; height: 100%"> 
        <swiper-slide v-for="movie in recentMovies" :key="movie.id">
          <router-link :to="{ name: 'MovieDetails', params: { id: movie.id }}">
            <div class="card-home-orizzontal">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`" class="card-img" alt="Photo not available" />
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ movie.title }}</h5>
                <star-rating :rating="movie.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <!-- Swiper per i film popolari -->
      <swiper v-if="category.id === 2 && popularMovies.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMorePopularMovies" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="movie in popularMovies" :key="movie.id">
          <router-link :to="{ name: 'MovieDetails', params: { id: movie.id }}">
            <div class="card">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto" />
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ movie.title }}</h5>
                <star-rating :rating="movie.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <!-- Swiper per le serie TV recenti -->
      <swiper v-if="category.id === 3 && recentSeries.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMoreRecentSeries" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="series in recentSeries" :key="series.id">
          <router-link :to="{ name: 'SeriesDetails', params: { id: series.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${series.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto" />
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ series.name }}</h5>
                <star-rating :rating="series.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <!-- Swiper per le serie TV popolari -->
      <swiper v-if="category.id === 4 && popularSeries.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMorePopularSeries" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="series in popularSeries" :key="series.id">
          <router-link :to="{ name: 'SeriesDetails', params: { id: series.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${series.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto" />
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ series.name }}</h5>
                <star-rating :rating="series.vote_average"></star-rating>
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

import StarRating from './StarRating.vue'; 

// Import componenti Swiper Vue.js 
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import stile Swiper 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// Import moduli richiesti 
import { Scrollbar } from 'swiper/modules';
import { Navigation } from 'swiper/modules';

export default {
  name: 'ListHome',
  components: { Swiper, SwiperSlide, StarRating },
  setup() {
    const store = useStore();

    const categories = computed(() => store.getters.getTranslations.navbar.categories.titoli);

    function getCategoryName(id) {
      const category = categories.value.find(cat => cat.id === id);
      return category ? category.name : '';
    }

    const modules = [Navigation, Scrollbar];

    return {
      categories,
      getCategoryName,
      modules,
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
      recentSeries: [],
      popularSeries: [],
      spinner: false,
      recentMoviesPage: 1, // Traccia la pagina corrente per i film recenti
      popularMoviesPage: 2, // Traccia la pagina corrente per i film popolari
      recentSeriesPage: 3, // Traccia la pagina corrente per le serie TV recenti
      popularSeriesPage: 1, // Traccia la pagina corrente per le serie TV popolari
      loadingRecentMovies: false, // Stato di caricamento per i film recenti
      loadingPopularMovies: false, // Stato di caricamento per i film popolari
      loadingRecentSeries: false, // Stato di caricamento per le serie TV recenti
      loadingPopularSeries: false // Stato di caricamento per le serie TV popolari
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.fetchRecentMovies();
      this.fetchPopularMovies();
      this.fetchRecentSeries();
      this.fetchPopularSeries();
    },
    async fetchData() {
      await Promise.all([
        this.fetchRecentMovies(),
        this.fetchPopularMovies(),
        this.fetchRecentSeries(),
        this.fetchPopularSeries()
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
        }
        });
        const data = await response.json();
        this.recentMovies = [...this.recentMovies, ...data.results];
        this.recentMoviesPage++;
        this.loadingRecentMovies = false;
        this.spinner=false;
      } catch (error) {
        console.error('Errore nel recupero dei film recenti:', error);
        this.loadingRecentMovies = false;
      }
    },
    async fetchPopularMovies() {
      if (this.loadingPopularMovies) return;
      this.loadingPopularMovies = true;

      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=${this.$store.state.currentLanguage}&page=${this.popularMoviesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        }
        });
        const data = await response.json();
        this.popularMovies = [...this.popularMovies, ...data.results];
        this.popularMoviesPage++;
        this.loadingPopularMovies = false;
      } catch (error) {
        console.error('Errore nel recupero dei film popolari:', error);
        this.loadingPopularMovies = false;
      }
    },
    async fetchRecentSeries() {
      if (this.loadingRecentSeries) return;
      this.loadingRecentSeries = true;

      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?language=${this.$store.state.currentLanguage}&page=${this.recentSeriesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        }
        });
        const data = await response.json();
        this.recentSeries = [...this.recentSeries, ...data.results];
        this.recentSeriesPage++;
        this.loadingRecentSeries = false;
      } catch (error) {
        console.error('Errore nel recupero delle serie TV recenti:', error);
        this.loadingRecentSeries = false;
      }
    },
    async fetchPopularSeries() {
      if (this.loadingPopularSeries) return;
      this.loadingPopularSeries = true;

      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/popular?language=${this.$store.state.currentLanguage}&page=${this.popularSeriesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        }
        });
        const data = await response.json();
        this.popularSeries = [...this.popularSeries, ...data.results];
        this.popularSeriesPage++;
        this.loadingPopularSeries = false;
      } catch (error) {
        console.error('Errore nel recupero delle serie TV popolari:', error);
        this.loadingPopularSeries = false;
      }
    },
    fetchMoreRecentMovies() {
      if (this.loadingRecentMovies) return;
      this.fetchRecentMovies();
    },
    fetchMorePopularMovies() {
      if (this.loadingPopularMovies) return;
      this.fetchPopularMovies();
    },
    fetchMoreRecentSeries() {
      if (this.loadingRecentSeries) return;
      this.fetchRecentSeries();
    },
    fetchMorePopularSeries() {
      if (this.loadingPopularSeries) return;
      this.fetchPopularSeries();
    }
  }
};
</script>
