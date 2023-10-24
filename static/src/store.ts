import { createStore } from "vuex";
import { Alert, State, User } from "./types";

export default createStore<State>({
    state: {
        alerts: [],
        status: null,
        user: null,
    },
    mutations: {
        ADD_ALERT(state: State, alert: Alert ) {
            state.alerts.push(alert);
            setTimeout(() => {
                state.alerts.shift();
            }, 3000);
        },
        LOGIN(state: State, user: User) {
            state.status = "success";
            state.user = user;
        },
        LOGOUT(state) {
            localStorage.removeItem("status");
            state.status = null;
            localStorage.removeItem("user");
            state.user = null;
        },
    },
    actions: {
        addAlert({ commit }, alert) {
            commit("ADD_ALERT", alert);
        },
        login({ commit }, user) {
            console.log(user);
            localStorage.setItem("user", user);
            commit("LOGIN", user);
        },
        logout({ commit }) {
            localStorage.removeItem("user");
            commit("LOGOUT");
        },
    },
    getters: {
        isAuthenticated: state => !!state.user,
        authStatus: state => state.status,
    }
})