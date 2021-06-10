<template>
    <div class="container-fluid bg-light">
      <h2>Helios Launcher</h2>

      <p>
        Welcome to the Helios Launcher, this launcher can download, unpack and start your game.
      </p>

      <ProgressBar/>
    </div>
</template>

<script>
import ProgressBar from './ProgressBar'

export default {
  data: () => ({
    message: 'Hello World'
  }),
  components: {
    ProgressBar
  }
}
</script>