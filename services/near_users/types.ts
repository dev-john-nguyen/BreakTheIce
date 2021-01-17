import { LocationObject } from 'expo-location';
import { StateCityProps, UserRootStateProps, UserProfilePreviewProps } from '../user/types';
import { TimelineLocationProps } from '../profile/tsTypes';
import { InvitationStatusOptions } from '../invitations/tsTypes';

export interface NearUsersActionProps {
    type: string;
    payload: {
        uid: string,
        status: InvitationStatusOptions,
        timeline: TimelineLocationProps[]
        nearBy: Array<NearByUsersProps>;
        all: Array<NearByUsersProps>;
        nearUsersListener: () => void;
    }
}

export interface NearByUsersProps extends UserProfilePreviewProps {
    friend: boolean;
    distance: number;
    sentInvite: boolean;
    receivedInvite: boolean;
}


export interface NearUsersRootProps {
    nearBy: Array<NearByUsersProps>;
    all: Array<NearByUsersProps>;
    fetched?: boolean;
    nearUsersListener?: () => void;
}

export interface NearUsersDispatchActionProps {
    set_and_listen_near_users: (stateZip: StateCityProps, location: LocationObject) => (() => void) | undefined;
    validate_near_users: (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<UserRootStateProps>) => void;
    reset_near_users: () => void;
}