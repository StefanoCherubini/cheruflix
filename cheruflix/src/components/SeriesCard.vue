<template>
  <div class="pagina">
    <br>
    <div class="row row-cols-1 row-cols-md-4 g-4" v-if="series.length > 0">
       <div class="col"  v-for="serie in series" :key="serie.id" >
               <div class="card  h-100">
                  <img :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`" class="card-img-top" alt="ops non abbiamo la foto">
                    <div class="card-body">
                        <h5 class="card-title poppins-regular">{{ serie.name }}</h5>
                        <p class="card-text poppins-regular">Anno: {{ serie.first_air_date.split('-')[0] }}</p>
                   </div>
              </div>
      </div>
   </div>
  </div>


</template>

<script>
export default {
  name: 'SeriesCard',
  data() {
    return {
      series: []
    };
  },
  mounted() {
    this.fetchSeriesDetails();
  },
  methods: {
    fetchSeriesDetails() {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjU5MDAzYmMzY2M4MmRiZDM4ZGM1MDZiYmY5ZjU5YSIsIm5iZiI6MTcxOTMwODUzOC43MzczNiwic3ViIjoiNjQ3NzU2ZDcxMmM2MDQwMGMyYzAwYjdiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gbzV5q-4G0ixagrceZwd4n3qsnOddSyQBpvtBEUUEow'
        }
      };

      fetch(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=8`, options)
        .then(response => response.json())
        .then(data => {
          this.series = data.results;
        })
        .catch(err => console.error(err));
    },

  }
};
</script>


