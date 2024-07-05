import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Importa Vuex store

const app = createApp(App);

app.use(router);
app.use(store); // Usa Vuex store

app.mount('#app');

