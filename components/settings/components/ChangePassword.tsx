import React from 'react';
import { View, TextInput, Text } from 'react-native';

export default () => {
    return (
        <View>
            <Text>Change Password</Text>
            <TextInput
                placeholder='Old Password'
            />
            <TextInput
                placeholder='New Password'
            />
            <TextInput
                placeholder='Reenter New Password'
            />
        </View>
    )
}