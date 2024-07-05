import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'home',
    component:  () => import( '@/views/Home.vue')
  },
  {
    path: '/Film',
    name: 'film',
    component:  () => import( '@/views/Film.vue')
  },
  {
    path: '/SerieTV',
    name: 'SerieTV',
    component: () => import( '@/views/SerieTV.vue')
  },
  {
    path: '/movie/:id',
    name: 'MovieDetails',
    component:() => import( '@/components/MovieDetails.vue'),
    props: true 
  },
  {
    path: '/series/:id',
    name: 'SeriesDetails',
    component:() => import( '@/components/SeriesDetails.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // Utilizza la History API con la base URL di Vite
  routes
})

export default router
