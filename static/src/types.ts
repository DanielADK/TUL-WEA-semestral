/**
 * @description: The alert object
 */
export interface Alert {
    type: string,
    message: string
}

/**
 * @description: The state of the application
 */
export interface State {
    alerts: Alert[],
    tasks: Task[],
    status: string | null,
    user: User | null,
}

/**
 * @description: The user object
 */
export interface User {
    id: number,
    username: string,
    token: string
}

/**
 * @description: The task object
 */
export interface Task {
    id: number,
    description: string,
    completed: boolean,
}