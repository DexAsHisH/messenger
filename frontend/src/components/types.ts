export interface INotification { from: string, to: string, message: string }

export interface IOnlineUser {
    userId: string,
    image: string,
    name: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
}