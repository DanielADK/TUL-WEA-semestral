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
        /**
         * Adds an alert to the store.
         * @param state
         * @param alert
         * @constructor
         */
        ADD_ALERT(state: State, alert: Alert ) {
            state.alerts.push(alert);
            setTimeout(() => {
                state.alerts.shift();
            }, 3000);
        },
        /**
         * Logs in a user and commits it to the store.
         * @param state
         * @param user
         * @constructor
         */
        LOGIN(state: State, user: User) {
            state.status = "success";
            state.user = user;
        },
        /**
         * Logs out a user and commits it to the store.
         * @param state
         * @constructor
         */
        LOGOUT(state: State) {
            state.status = null;
            state.user = null;
        },
        /**
         * Fetches tasks from the API and commits them to the store.
         * @param state
         * @param tasks
         * @constructor
         */
        SET_TASKS(state: State, tasks: Task[]) {
            state.tasks = tasks;
        },
        /**
         * Creates a task and commits it to the store.
         * @param state
         * @param task
         * @constructor
         */
        ADD_TASK(state, task) {
            state.tasks.push(task);
        },
        /**
         * Modifies a task and commits it to the store.
         * @param state
         * @param updatedTask
         * @constructor
         */
        UPDATE_TASK(state, updatedTask) {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                state.tasks[index] = updatedTask;
            }
        },
        /**
         * Removes a task from the store.
         * @param state
         * @param id
         * @constructor
         */
        DELETE_TASK(state, id) {
            state.tasks = state.tasks.filter(task => task.id !== id);
        }
    },
    actions: {
        /**
         * Adds an alert to the store.
         * @param commit
         * @param alert
         */
        addAlert({ commit }: {commit: Commit }, alert: Alert) {
            commit("ADD_ALERT", alert);
        },
        /**
         * Logs in a user and commits it to the store.
         * @param commit
         * @param user
         */
        login({ commit }: {commit: Commit }, user: User) {
            commit("LOGIN", user);
        },
        /**
         * Logs out a user and commits it to the store.
         * @param commit
         */
        logout({ commit }: {commit: Commit }) {
            commit("LOGOUT");
        },
        /**
         * Fetches tasks from the API and commits them to the store.
         * @param commit
         * @param state
         * @param dispatch
         */
        async fetchTasks({ commit, state, dispatch }) {
            if (state.user) {
                const response = await api.getTasks(state.user.token);
                if (response.status == 200 || response.status == 201) {
                    commit("SET_TASKS", response.data);
                } else {
                    dispatch("addAlert", { type: "error", message: "Failed to fetch tasks." });
                }
            }
        },
        /**
         * Creates a task and commits it to the store.
         * @param commit
         * @param state
         * @param dispatch
         * @param description
         */
        async createTask({ commit, state, dispatch }, description) {
            if (state.user) {
                console.log(description)
                const response = await api.addTask(state.user.token, description);
                if (response.status == 200 || response.status == 201) {
                    commit("ADD_TASK", response.data);
                } else {
                    dispatch("addAlert", { type: "error", message: "Failed to create task." });
                }
            }
        },
        /**
         * Modifies a task and commits it to the store.
         * @param commit
         * @param state
         * @param dispatch
         * @param id
         * @param data
         */
        async modifyTask({ commit, state, dispatch }, { id, data }) {
            if (state.user) {
                const response = await api.updateTask(state.user.token, id, data);
                if (response.status == 200 || response.status == 201) {
                    commit("UPDATE_TASK", response.data);
                } else {
                    dispatch("addAlert", { type: "error", message: "Failed to modify task." });
                }
            }
        },
        /**
         * Removes a task from the store.
         * @param commit
         * @param state
         * @param dispatch
         * @param id
         */
        async removeTask({ commit, state, dispatch }, id) {
            if (state.user) {
                const response = await api.deleteTask(state.user.token, id);
                if (response.status == 200 || response.status == 201) {
                    commit("DELETE_TASK", id);
                } else {
                    dispatch("addAlert", { type: "error", message: "Failed to delete task." });
                }
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