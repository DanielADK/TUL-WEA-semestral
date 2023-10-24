export interface Alert {
    type: string,
    message: string
}
export interface State {
    alerts: Alert[],
    status: string | null,
    user: User | null,
}

export interface User {
    id: number,
    username: string,
    token: string
}