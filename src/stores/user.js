export default {
    namespaced: true,
    store: () => ({
        token: null
    }),
    mutations: {},
    actions: {},
    getters: {
        isAuthenticated: state => {
            return !!state.token;
        }
    }
}