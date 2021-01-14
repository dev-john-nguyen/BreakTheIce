import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { CustomButton } from '../../../utils/components';

export default ({ signout }: { signout: () => void }) => {
    return (
        <View style={{ flex: 1, margin: 20 }}>
            <CustomButton type='primary' text='Sign Out' onPress={signout} />
        </View>
    )
}