import { createApp } from "vue";
import { pinia } from "@/app/providers/store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./app/App.vue";
import router from "./app/providers/router";
import "./app/styles/main.css";

const app = createApp(App)

const options = {
    position: "bottom-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
};

app.use(pinia);
app.use(router);
app.use(Toast, options);
app.mount('#app')
