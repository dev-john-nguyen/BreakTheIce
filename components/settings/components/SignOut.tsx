import React from 'react';
import { View } from 'react-native';
import { CustomButton } from '../../utils';

export default ({ signout }: { signout: () => void }) => {
    return (
        <View style={{ flex: 1, margin: 30 }}>
            <CustomButton type='primary' text='Sign Out' onPress={signout} />
        </View>
    )
}