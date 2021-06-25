<template>
    <div>
        <h2 class="header">
            Helios <br />
            <small>Need for Speed: World</small>
        </h2>

        <form v-on:submit="launch">
            <input type="text" class="input" id="username" placeholder="Username" v-model="username">
            <input type="password" class="input" id="password" placeholder="Password" v-model="password">

            <ServerList v-on:change-server="setServer"/>

            <button class="button" :disabled="isDisabled" type="submit">
                {{ message }}
            </button>
        </form>

        <Status v-bind:is-done="isDone" v-bind:progress-message="progressMessage" v-bind:progress-percentage="progressPercentage" />
    </div>
</template>

<script>
import Messenger from "../lib/messenger";
import ServerList from './ServerList';
import Status from "./Status";

const messenger = new Messenger();

export default {
    created() {
        messenger
            .on('status:update', (message, percentage) => {
                this.progressMessage = message;
                this.progressPercentage = percentage;
            })
            .on('client:ready', () => {
                this.isDone = true;
            })
            .on('client:running', (running) => {
                this.isRunning = running;
            })
            .send('app:started');
    },
    data: () => ({
        isRunning: false,
        isDone: false,
        progressMessage: '',
        progressPercentage: '',
        username: '',
        password: '',
        server: null
    }),
    computed: {
        isDisabled() {
            console.log(this.server);

            return !this.server || this.isRunning || !this.isDone;
        },
        message() {
            if (this.isDone) {
                return 'Launch!';
            } else if (this.isRunning) {
                return 'Running!';
            }

            return `${this.progressMessage}, please wait`;
        }
    },
    methods: {
        launch(event) {
            event.preventDefault();

            if (this.isDisabled) {
                return;
            }

            messenger.send('client:launch', this.server, this.username, this.password);
        },
        setServer(server) {
            this.server = server;
        }
    },
    components: {
        Status,
        ServerList
    }
}
</script>