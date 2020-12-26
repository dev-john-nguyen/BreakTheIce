import React from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';

const EditProfile = () => {
    const exLocationHistory = [
        {
            docId: '1',
            country: 'USA',
            city: 'Bellevue',
            state: 'Washington',
            bio: 'Im born here!',
            fromDate: new Date('10/14/1994'),
            toDate: new Date('12/19/2017'),
            createdAt: new Date(),
            updatedAt: new Date(),
            placesVisted: [
                {
                    coordinate: {
                        latitude: 1,
                        longitude: 1
                    },
                    name: 'Teryaki'
                }
            ]
        },
        {
            docId: '2',
            country: 'Egypt',
            city: 'Cairo',
            state: undefined,
            bio: 'Traveled here to play football',
            fromDate: new Date('12/19/2017'),
            toDate: new Date('12/19/2020'),
            createdAt: new Date(),
            updatedAt: new Date(),
            placesVisted: [
                {
                    coordinate: {
                        latitude: 1,
                        longitude: 1
                    },
                    name: 'Teryaki'
                }
            ]
        }
    ]
    return (
        <View>
            <TextInput placeholder='Name' />
            <TextInput placeholder='Short Bio' multiline />
            <TextInput placeholder='Long Bio' multiline />
            <TextInput placeholder='Age' keyboardType='numeric' maxLength={3} />
            <TextInput />
            <TextInput />
        </View>
    )
}

export default EditProfile;