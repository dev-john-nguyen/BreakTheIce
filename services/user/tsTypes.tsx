import { LocationObject } from 'expo-location';


export interface UserActionProps {
    type: string;
    payload?: {
        uid?: string,
        location?: LocationObject,
        stateCity?: StateCityProps
    } | UserRootStateProps
}
export interface StateCityProps {
    state: string;
    city: string
}

export interface UserRootStateProps {
    uid: string;
    username: string;
    location: LocationObject;
    stateCity: StateCityProps;
    name: string;
    age: number;
    bioLong: string;
    bioShort: string;
    gender: string;
    isPrivate: boolean;
    fetchFail?: boolean;
}

export interface UserDispatchActionsProps {
    set_and_listen_user_location: (stateCity: StateCityProps, location: LocationObject) => void;
}

// export interface UserProfileProps {
//     uid: string;
//     name: string;
//     age: number;
//     bioLong: string;
//     bioShort: string;
//     gender: string;
//     stateCity: StateCityProps;
// }