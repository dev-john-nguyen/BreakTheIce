import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Item1, Item2, Item3, Item4 } from './svg';
import { colors, normalize } from '../utils/styles';
import { UnderlineHeader, CustomButton } from '../utils';


export default () => {
    return (
        <View style={styles.container}>
            <UnderlineHeader
                textStyle={styles.header}
                height={12}
                colorFrom={colors.primary}
                colorTo={colors.tertiary}
            >Break The Ice</UnderlineHeader>
            <View style={styles.section}>
                <View style={{ flex: 1 }}>
                    <Item1 />
                </View>
                <View style={{ flex: 1 }} />
            </View>
            <View style={styles.section}>
                <View style={styles.button_container}>
                    <View>
                        <CustomButton type='primary' text='Login' />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Item2 />
                </View>
            </View>
            <View style={styles.section}>
                <View style={{ flex: 1 }}>
                    <Item3 />
                </View>
                <View style={styles.button_container}>
                    <View>
                        <CustomButton type='secondary' text='Sign Up' />
                    </View>
                </View>
            </View>
            <View style={styles.section}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1 }}>
                    <Item4 />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        padding: 20,
        paddingTop: 50
    },
    header: {
        alignSelf: 'center',
        fontSize: normalize(25),
        color: colors.primary
    },
    section: {
        flexDirection: 'row',
        flex: 1,
        margin: 20
    },
    button_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})