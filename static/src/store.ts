import { createStore } from "vuex";
import type { Store, Commit } from "vuex";
import type { Alert, State, User, Task } from "./types";
import createPersistedState from "vuex-persistedstate";
import * as api from "./api";

const store = createStore<State>({
    state: {
        alerts: [],
        tasks: [],
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
            state.status = null;
            state.user = null;
        },
        SET_TASKS(state: State, tasks: Task[]) {
            state.tasks = tasks;
        },
        ADD_TASK(state, task) {
            state.tasks.push(task);
        },
        UPDATE_TASK(state, updatedTask) {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                state.tasks[index] = updatedTask;
            }
        },
        DELETE_TASK(state, id) {
            state.tasks = state.tasks.filter(task => task.id !== id);
        }
    },
    actions: {
        addAlert({ commit }: {commit: Commit }, alert: Alert) {
            commit("ADD_ALERT", alert);
        },
        login({ commit }: {commit: Commit }, user: User) {
            commit("LOGIN", user);
        },
        logout({ commit }: {commit: Commit }) {
            commit("LOGOUT");
        },
        async fetchTasks({ commit, state }) {
            if (state.user) {
                const response = await api.getTasks(state.user.token);
                commit("SET_TASKS", response.data);
            }
        },
        async createTask({ commit, state }, description) {
            if (state.user) {
                const response = await api.addTask(state.user.token, description);
                commit("ADD_TASK", response.data);
            }
        },
        async modifyTask({ commit, state }, { id, data }) {
            if (state.user) {
                const response = await api.updateTask(state.user.token, id, data);
                commit("UPDATE_TASK", response.data);
            }
        },
        async removeTask({ commit, state }, id) {
            if (state.user) {
                await api.deleteTask(state.user.token, id);
                commit("DELETE_TASK", id);
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.user,
        authStatus: state => state.status,
        user: state => state.user,
    },
    plugins: [createPersistedState({
        paths: ["user", "status"], // Filter of states to persist
    })]
});

export default store;