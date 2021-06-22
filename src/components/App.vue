<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col text-center">
          <h2>Helios</h2>
          <p>
            Need for Speed: World
          </p>

          <div class="card" style="margin: 0 auto;">
            <form v-on:submit="launch">
              <div class="card-body">
                <div class="card-text">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="username" placeholder="Username" v-model="username">
                    <label for="username">Username</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
                    <label for="password">Password</label>
                  </div>
                </div>
              </div>
              <div class="card-footer text-end">
                <button class="btn btn-block btn-success" :disabled="isDisabled" type="submit">
                  {{ message }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Messenger from "../lib/messenger";
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
  }),
  computed: {
    isDisabled() {
      return this.isRunning || !this.isDone;
    },
    message() {
      if(this.isDone) {
        return 'Launch!';
      } else if(this.isRunning) {
        return 'Running!';
      }

      return `${this.progressMessage} (${this.progressPercentage}%)`;
    }
  },
  methods: {
    launch() {
      if(this.isDisabled) {
        return;
      }

      console.log('Called');
      messenger.send('client:launch', this.username, this.password);
    }
  }
}
</script>