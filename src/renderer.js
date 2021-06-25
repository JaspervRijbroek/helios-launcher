import Vue from "vue/dist/vue.esm.browser";
import App from './components/App'

import './assets/css/style.css'

new Vue({
    el: '#root',
    render: h => h(App)
})