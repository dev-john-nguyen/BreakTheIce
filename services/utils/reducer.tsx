import { SET_ERROR, REMOVE_ERROR, SET_LOADING, REMOVE_LOADING } from './actionTypes';
import { UtilsActionProps } from './tsTypes'

const INITIAL_STATE = {
    error: null,
    loading: true
}

export default (state: Object = INITIAL_STATE, action: UtilsActionProps) => {
    switch (action.type) {
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case REMOVE_ERROR:
            return {
                ...state,
                error: null
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case REMOVE_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}