import { createStore } from "vuex";

export default createStore({
    state: {
        alerts: [],
        token: localStorage.getItem("token") || "",
        status: ""
    },
    mutations: {
        ADD_ALERT(state, alert) {
            state.alerts.push(alert);
            setTimeout(() => {
                state.alerts.shift();
            }, 3000);
        },
        AUTH_SUCCESS(state, token) {
            state.status = "success";
            state.token = token;
        },
        LOGOUT(state) {
            state.status = "";
            state.token = "";
        }
    },
    actions: {
        addAlert({ commit }, alert) {
            commit("ADD_ALERT", alert);
        },
        login({ commit }, payload) {
            localStorage.setItem("token", payload.token);
            commit("AUTH_SUCCESS", payload.token);
        },
        logout({ commit }) {
            localStorage.removeItem("token");
            commit("LOGOUT");
        }
    },
    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
    }
})