import { SET_LOADING, REMOVE_LOADING, SET_BANNER, REMOVE_BANNER, SET_NOTIFICATION, REMOVE_NOTIFICATION } from './actionTypes';



export const set_banner = (message: string, type: 'error' | 'warning' | 'success') => ({
    type: SET_BANNER,
    payload: {
        message,
        type
    }
})

export const remove_banner = () => ({
    type: REMOVE_BANNER
})

export const notification = (message: string) => ({
    type: SET_NOTIFICATION,
    payload: message
})

export const remove_notification = () => ({
    type: REMOVE_NOTIFICATION
})

export const set_loading = {
    type: SET_LOADING,
    payload: undefined
}

export const remove_loading = {
    type: REMOVE_LOADING,
    payload: undefined
}

