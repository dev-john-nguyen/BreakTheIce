import { NearByUsersProps } from '../near_users/tsTypes';

export interface TimelineActionProp {
    type: string;
    payload: any;
}

export interface TimelineLocationProps {
    docId: string
    country: string | undefined,
    city: string,
    state: string | undefined,
    comment: string,
    startAt: Date,
    endAt?: Date,
    createdAt: Date,
    updatedAt: Date,
    placesVisited: PlaceProp[] | undefined
}

export interface PlaceProp {
    id: string,
    coordinate: {
        latitude: number,
        longitude: number
    },
    name: string,
    comment: string,
    removed?: boolean
}


export interface ProfileRootProps {
    current: NearByUsersProps;
    history: any;
}

export interface TimelineRootProps {
    history: TimelineLocationProps[]
}

export interface TimelineDispatchActionProps {
    set_timeline: (uid: string) => void;
    set_current_profile: (profileUid: string) => void;
    remove_current_profile: () => void;
}

export interface ProfileDispatchActionProps {
    set_timeline: (uid: string) => void;
    set_current_profile: (profileUid: string) => Promise<void | NearByUsersProps>;
    remove_current_profile: () => void;
}
