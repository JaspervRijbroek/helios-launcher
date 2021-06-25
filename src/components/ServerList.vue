<template>
    <select class="input" id="server" v-on:change="changeSelection">
        <option>Select</option>
        <option v-for="server in serverList" :value="server.url">{{ server.label }}</option>
    </select>
</template>

<script>
export default {
    props: ['setServer'],
    async created() {
        let response = await (await fetch('https://api.github.com/gists/05ce5197d3ae96953fd4a89519369137')).json()

        if (response.files['serverlist.json']) {
            this.serverList = await (await fetch(response.files['serverlist.json'].raw_url)).json();
        }
    },
    data: () => ({
        message: 'Select',
        serverList: []
    }),
    computed: {
        loading() {
            return !this.serverList.length
        }
    },
    methods: {
        changeSelection(event) {
            this.$emit('change-server', event.target.value);
        }
    }
}
</script>