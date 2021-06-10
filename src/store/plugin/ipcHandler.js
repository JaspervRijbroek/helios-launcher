import Messenger from "../../lib/messenger";

export default (store) => {
    if(localStorage.getItem('state')) {
        store.replaceState(JSON.parse(localStorage.getItem('state')))
    }

    store.subscribe((mutation, state) => {
        localStorage.setItem('state', JSON.stringify(state));
    })

    let messenger = new Messenger(store);

    messenger.on('status:update', (message, percentage) => {
        if(percentage) {
            store.state.showProgress = true;
        }

        store.state.percentage = percentage;
        store.state.progressMessage = message;
    });
    messenger.on('client:ready', () => {
        store.state.showProgress = false;
        alert('Download is done!');
    });

    messenger.send('app:started');
}