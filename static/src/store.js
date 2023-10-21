import { createStore } from "vuex";

export default createStore({
    state: {
        alerts: []
    },
    mutations: {
        ADD_ALERT(state, alert) {
            state.alerts.push(alert);
            setTimeout(() => {
                state.alerts.shift();
            }, 5000);
        }
    },
    actions: {
        addAlert({ commit }, alert) {
            commit("ADD_ALERT", alert);
        }
    }
})