import Vue from "vue/dist/vue.esm.browser";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App'

new Vue({
    el: '#root',
    render: h => h(App)
})