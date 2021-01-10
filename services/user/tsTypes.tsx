import { LocationObject } from 'expo-location';
import { TimelineLocationProps, PlaceProp } from '../profile/tsTypes';

export interface UserActionProps {
    type: string;
    payload: {
        uid: string,
        location: LocationObject,
        stateCity: StateCityProps,
        placesVisited: PlaceProp[],
        timelineLocDocId: string,
        timelineLocObj: TimelineLocationProps,
        gallery: GalleryItemProps[]
    }
}
export interface StateCityProps {
    state: string;
    city: string
}

export interface GalleryItemProps {
    url: string;
    description: string;
    updatedAt: Date;
    id: string;
    cachedUrl?: string;
    name: string;
}

export interface NewGalleryItemProps {
    id: string;
    name: string;
    uri?: string;
    url?: string;
    blob?: Blob;
    description: string;
    updatedAt?: Date;
    cachedUrl?: string;
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
    gallery: GalleryItemProps[];
    fetchFail?: boolean;
    timeline?: TimelineLocationProps[]
}

export interface UserDispatchActionsProps {
    set_and_listen_user_location: (stateCity: StateCityProps, location: LocationObject) => void;
    update_profile: (data: any) => void
    save_gallery: (newGallery: NewGalleryItemProps[]) => void;
    // update_timeline_places_visited: (uid: string, locationDocId: string, placesVisited: PlaceProp[]) => Promise<PlaceProp[] | void>;
    // add_timeline_location: (newLocation: Omit<TimelineLocationProps, 'docId'>) => Promise<void | boolean | undefined>;
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