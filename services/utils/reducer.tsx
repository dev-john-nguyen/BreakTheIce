import { SET_LOADING, REMOVE_LOADING, SET_BANNER, REMOVE_BANNER } from './actionTypes';
import { UtilsActionProps } from './tsTypes'

const INITIAL_STATE = {
    loading: true,
    banner: []
}

export default (state = INITIAL_STATE, action: UtilsActionProps) => {
    switch (action.type) {
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
        case SET_BANNER:
            return {
                ...state,
                banner: [...state.banner, action.payload]
            }
        case REMOVE_BANNER:
            return {
                ...state,
                banner: []
            }
        default:
            return state;
    }
}