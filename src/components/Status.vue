<template>
    <div :class="showClass">
        <progress id="progress" :value="progressPercentage" max="100"></progress>
        <label for="progress">{{ progressMessage }} ({{ progressPercentage }}%)</label>
    </div>
</template>

<script>
export default {
    props: ['isDone', 'progressMessage', 'progressPercentage'],
    computed: {
        showClass() {
            return 'status-bar ' + (this.isDone ? '' : 'is-visible')
        }
    }
}
</script>