// api.ts
import axios from "axios";

//const global_url = "http://localhost:5000"; // local testing
const global_url = "https://api-todo.danieladamek.eu"; // public

/**
 * Logs in a user.
 * @param username
 * @param password
 */
export const login = async (username: string, password: string) => {
    return await axios.post(global_url + "/login", { username, password });
}

/**
 * Gets tasks from the API.
 * @param token
 */
export const getTasks = async (token: string) => {
    return await axios.get(global_url + "/tasks", {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Adds a task to the API.
 * @param token
 * @param description
 */
export const addTask = async (token: string, description: string) => {
    return await axios.post(global_url + "/tasks", { description }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Updates a task in the API.
 * @param token
 * @param id
 * @param data
 */
export const updateTask = async (token: string, id: number, data: any) => {
    return await axios.put(global_url + "/tasks/" + id, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Deletes a task from the API.
 * @param token
 * @param id
 */
export const deleteTask = async (token: string, id: number) => {
    return await axios.delete(global_url + "/tasks/" + id, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
