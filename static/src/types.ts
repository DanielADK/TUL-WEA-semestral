export interface Alert {
    type: string,
    message: string
}
export interface State {
    alerts: Alert[],
    tasks: Task[],
    status: string | null,
    user: User | null,
}

export interface User {
    id: number,
    username: string,
    token: string
}

export interface Task {
    id: number,
    description: string,
    completed: boolean,
}