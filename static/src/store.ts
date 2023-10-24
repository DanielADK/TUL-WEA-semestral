import { createStore } from "vuex";
import type { Store, Commit } from "vuex";
import type { Alert, State, User } from "./types";

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
        LOGOUT(state: State) {
            localStorage.removeItem("status");
            state.status = null;
            localStorage.removeItem("user");
            state.user = null;
        },
    },
    actions: {
        addAlert({ commit }: {commit: Commit }, alert: Alert) {
            commit("ADD_ALERT", alert);
        },
        login({ commit }: {commit: Commit }, user: User) {
            console.log(user);
            localStorage.setItem("user", JSON.stringify(user));
            commit("LOGIN", user);
        },
        logout({ commit }: {commit: Commit }) {
            localStorage.removeItem("user");
            commit("LOGOUT");
        },
    },
    getters: {
        isAuthenticated: state => !!state.user,
        authStatus: state => state.status,
        user: state => state.user,
    }
})