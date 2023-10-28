// api.ts
import axios from "axios";

//const global_url = "http://localhost:5000"; // local testing
const global_url = "https://api-todo.danieladamek.eu"; // public

export const login = async (username: string, password: string) => {
    return await axios.post(global_url + "/login", { username, password });
}

export const getTasks = async (token: string) => {
    return await axios.get(global_url + "/tasks", {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const addTask = async (token: string, description: string) => {
    return await axios.post(global_url + "/tasks", { description }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateTask = async (token: string, id: number, data: any) => {
    return await axios.put(global_url + "/tasks/" + id, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteTask = async (token: string, id: number) => {
    return await axios.delete(global_url + "/tasks/" + id, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
