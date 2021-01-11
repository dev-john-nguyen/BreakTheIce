import { LocationObject } from 'expo-location';
import { StateCityProps, UserRootStateProps, GalleryItemProps } from '../user/tsTypes';
import { TimelineLocationProps } from '../profile/tsTypes';

export interface NearUsersActionProps {
    type: string;
    payload?: NearUsersRootProps | string | { uid: string, timeline: TimelineLocationProps[] }
}

export interface NearByUsersProps extends Omit<UserRootStateProps, 'gallery'> {
    friend: boolean;
    distance: number;
    sentInvite: boolean;
    gallery: (GalleryItemProps & { nearbyUserCachedUrl: string | void | undefined })[]
}


export interface NearUsersRootProps {
    nearBy: Array<NearByUsersProps>;
    all: Array<NearByUsersProps>;
    fetched?: boolean;
}

export interface NearUsersDispatchActionProps {
    set_and_listen_near_users: (uid: string, stateZip: StateCityProps, location: LocationObject) => void;
    validate_near_users: (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<UserRootStateProps>) => void;
}