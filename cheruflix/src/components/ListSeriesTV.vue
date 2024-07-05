<template>
   <div v-show="spinner" style="margin-top: 40px">
    <div style="height: 800px;">
    </div>
  </div>

  <div class="mx-auto pagina">
    <!-- Titoli e i loro rispettivi Swipers -->
    <div v-for="category in categories" :key="category.id">
      <h2>{{ getCategoryName(category.id) }}</h2>

      <swiper v-if="category.id === 1 && recentSeries.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMoreRecentSeries" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="series in recentSeries" :key="series.id">
          <router-link :to="{ name: 'SeriesDetails', params: { id: series.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${series.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ series.name }}</h5>
                <star-rating :rating="series.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <swiper v-if="category.id === 2 && popularSeries.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMorePopularSeries" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="series in popularSeries" :key="series.id">
          <router-link :to="{ name: 'SeriesDetails', params: { id: series.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${series.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
              <div class="card-body">
                <h5 class="card-title poppins-regular">{{ series.name }}</h5>
                <star-rating :rating="series.vote_average"></star-rating>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>

      <swiper v-if="category.id === 3 && upcomingSeries.length > 0" :slides-per-view="6" :space-between="6" @reachEnd="fetchMoreUpcomingSeries" :scrollbar="{ hide: true, draggable: true }" :modules="modules">
        <swiper-slide v-for="series in upcomingSeries" :key="series.id">
          <router-link :to="{ name: 'SeriesDetails', params: { id: series.id }}">
            <div class="card h-100">
              <img :src="`https://image.tmdb.org/t/p/w500${series.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
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


import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';
import StarRating from './StarRating.vue';

export default {
  name: 'ListSeriesTV',
  components: { Swiper, SwiperSlide, StarRating },
  setup() {
    const store = useStore();
   
    const categories = computed(() => store.getters.getTranslations.navbar.categories.serie);

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
      recentSeries: [],
      popularSeries: [],
      upcomingSeries: [],
      spinner: false,
      recentSeriesPage: 1,
      popularSeriesPage: 2,
      upcomingSeriesPage: 4,
      loadingRecentSeries: false,
      loadingPopularSeries: false,
      loadingUpcomingSeries: false,
    };
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.fetchRecentSeries();
      this.fetchPopularSeries();
      this.fetchUpcomingSeries();
    },
    async fetchData() {
      await Promise.all([
        this.fetchRecentSeries(),
        this.fetchPopularSeries(),
        this.fetchUpcomingSeries(),
      ]);
    },
    async fetchRecentSeries() {
      if (this.loadingRecentSeries) return;
      this.loadingRecentSeries = true;
      this.spinner=true;
      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/airing_today?language=${this.$store.state.currentLanguage}&page=${this.recentSeriesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
          }
        });
        const data = await response.json();
        this.recentSeries = [...this.recentSeries, ...data.results];
        this.recentSeriesPage++;
        this.spinner=false;
      } catch (error) {
        console.error('Error fetching recent series:', error);
      } finally {
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
      } catch (error) {
        console.error('Error fetching popular series:', error);
      } finally {
        this.loadingPopularSeries = false;
      }
    },
    async fetchUpcomingSeries() {
      if (this.loadingUpcomingSeries) return;
      this.loadingUpcomingSeries = true;

      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?language=${this.$store.state.currentLanguage}&page=${this.upcomingSeriesPage}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
          }
        });
        const data = await response.json();
        this.upcomingSeries = [...this.upcomingSeries, ...data.results];
        this.upcomingSeriesPage++;
      } catch (error) {
        console.error('Error fetching upcoming series:', error);
      } finally {
        this.loadingUpcomingSeries = false;
      }
    },
    fetchMoreRecentSeries() {
      if (!this.loadingRecentSeries) {
        this.fetchRecentSeries();
      }
    },
    fetchMorePopularSeries() {
      if (!this.loadingPopularSeries) {
        this.fetchPopularSeries();
      }
    },
    fetchMoreUpcomingSeries() {
      if (!this.loadingUpcomingSeries) {
        this.fetchUpcomingSeries();
      }
    },
  },
};
</script>
