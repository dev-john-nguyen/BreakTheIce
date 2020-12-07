import { LocationObject } from 'expo-location';


export interface UserActionProps {
    type: string;
    payload?: {
        uid?: string,
        location?: LocationObject,
        stateCity?: StateCityProps
    }
}
export interface StateCityProps {
    state: string;
    city: string
}

export interface UserRootStateProps {
    uid: string;
    location: LocationObject;
    stateCity: StateCityProps
}

export interface UserDispatchActionsProps {
    set_user_location: (uid: string, userstateCity: StateCityProps, location: LocationObject) => void;
    update_user_location: (uid: string, userstateCity: StateCityProps, location: LocationObject) => void;
}