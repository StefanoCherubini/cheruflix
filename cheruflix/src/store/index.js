import { createStore } from 'vuex';
import texts from '../texts.json'; // Assicurati che questo percorso sia corretto

export default createStore({
  state: {
    currentLanguage: 'en-US', // Lingua predefinita
    texts: texts['en-US'], // Testi predefiniti in inglese
  },
  mutations: {
    setLanguage(state, languageCode) {
      state.currentLanguage = languageCode;
      state.texts = texts[languageCode] || texts['en-US']; // Imposta i testi in base alla lingua selezionata
    },
  },
  actions: {
    setLanguage({ commit }, languageCode) {
      commit('setLanguage', languageCode);
    }
  },
  modules: {},
  getters: {
    // Getter per ottenere le traduzioni in base alla lingua corrente
    getTranslations(state) {
      return state.texts;
    },
  },
});