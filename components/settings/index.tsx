import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import { colors } from '../../utils/styles';
import { SettingsSvg, EditSvg, PortraitSvg } from '../../utils/components';
import { MeStackNavigationProp } from '../navigation/utils';

const Settings = ({ navigation }: { navigation: MeStackNavigationProp }) => {
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.item_container}
                onPress={() => navigation.navigate("EditGallery")}
                underlayColor={colors.secondary}
            >
                <View style={styles.content}>
                    <PortraitSvg />
                    <Text style={styles.text}>Edit Gallery</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.item_container}
                onPress={() => navigation.navigate("EditProfile")}
                underlayColor={colors.secondary}
            >
                <View style={styles.content}>
                    <EditSvg />
                    <Text style={styles.text}>Edit Profile</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.item_container}
                onPress={() => navigation.navigate("GeneralSettings")}
                underlayColor={colors.secondary}
            >
                <View style={styles.content}>
                    <SettingsSvg />
                    <Text style={styles.text}>General Settings</Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    item_container: {
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        position: 'relative',
        alignItems: 'center',
        marginBottom: 20
    },
    content: {
        flexDirection: 'row',
        padding: 20,
        width: '50%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        color: colors.primary
    }
})


export default Settings;