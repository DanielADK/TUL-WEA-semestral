import './assets/main.css'
import 'bootstrap';

import { createApp } from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";

/**
 * @description: Create the Vue app
 */
createApp(App)
    .use(router)
    .use(store)
    .mount("#app");