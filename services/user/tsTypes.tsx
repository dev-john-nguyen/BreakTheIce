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
        gallery: GalleryProps
    }
}
export interface StateCityProps {
    state: string;
    city: string
}

export interface GalleryProps {
    url: string;
    description: string;
    updatedAt: Date;
    id: string;
}

export interface NewGalleryProps extends Omit<GalleryProps, 'url' | 'updatedAt'> {
    uri: string;
    blob: Blob;
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
    gallery: GalleryProps[];
    fetchFail?: boolean;
    timeline?: TimelineLocationProps[]
}

export interface UserDispatchActionsProps {
    set_and_listen_user_location: (stateCity: StateCityProps, location: LocationObject) => void;
    update_profile: (data: any) => void
    save_gallery: (newGallery: NewGalleryProps[]) => void;
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