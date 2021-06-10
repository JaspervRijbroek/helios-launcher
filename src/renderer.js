/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import Vue from "vue/dist/vue.esm.browser";
import Vuex from 'vuex/dist/vuex.esm.browser'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App'
import IpcHandler from './store/plugin/ipcHandler';

Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [IpcHandler],
    state: {
        showProgress: false,
        percentage: 0,
        progressMessage: '',
        gamePath: '/var/game'
    },
    mutations: {
        showProgress(state, show = false) {
            state.showProgress = show;
        }
    },
    actions: {
        selectPath() {
            // ipcRenderer.emit('')?
        }
    }
})

new Vue({
    el: '#root',
    render: h => h(App),
    store
})