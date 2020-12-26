
export interface LocationHistoryProps {
    docId: string
    country?: string,
    city: string,
    state?: string,
    bio: string,
    fromDate: Date,
    toDate: Date,
    createdAt: Date,
    updatedAt: Date,
    placesVisted: PlaceProp[]
}

export interface PlaceProp {
    docId: string,
    coordinate: {
        latitude: number,
        longitude: number
    },
    name: string,
    comment: string
}
