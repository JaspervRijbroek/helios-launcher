<template>
  <div class="progress" v-if="showProgress">
    <div class="progress-bar progress-bar-striped progress-bar-animated" v-bind:style="{width: percentage + '%'}">
      {{ progressMessage }}
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  data: () => ({
    width: 50
  }),
  computed: mapState(['showProgress', 'progressMessage', 'percentage'])
}
</script>