// api.ts
import axios from "axios";

export const getTasks = async (token: string) => {
    return await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: `${token}` }
    });
};

export const addTask = async (token: string, description: string) => {
    return await axios.post("http://localhost:5000/tasks", { description }, {
        headers: { Authorization: `${token}` }
    });
};

export const updateTask = async (token: string, id: number, data: any) => {
    return await axios.put(`http://localhost:5000/tasks/${id}`, data, {
        headers: { Authorization: `${token}` }
    });
};

export const deleteTask = async (token: string, id: number) => {
    return await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
