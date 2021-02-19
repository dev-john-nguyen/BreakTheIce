import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { HeaderText, BodyText, Icon } from '../../../../utils';
import { normalize, colors } from '../../../../utils/styles';
import { FontAwesome } from '@expo/vector-icons';

export default () => (
    <View style={styles.container}>
        <HeaderText style={styles.header}>Important Tips</HeaderText>
        <ScrollView style={styles.content}>

            <BodyText style={styles.body_text}><FontAwesome name="warning" size={15} color={colors.yellow} /> If you feel like you are in danger please contact law enforcement.</BodyText>
            <BodyText style={styles.body_text}><FontAwesome name="warning" size={15} color={colors.yellow} /> Please report any suspicious behavior by contacting us directly or use the report option under the menu of the target user.</BodyText>
            <BodyText style={styles.body_text}><FontAwesome name="warning" size={15} color={colors.yellow} /> Report any authorized usage or users</BodyText>

            <HeaderText style={styles.body_header_text}>Actions that you can take if you feel unsafe.</HeaderText>
            <BodyText style={styles.body_text}>You can block the user by visiting the menu located on the top right of their profile.</BodyText>
            <BodyText style={styles.body_text}>You can report the user by visiting the menu located on the top right of their profile.</BodyText>
            <BodyText style={styles.body_text}>You can hide yourself from the map to prevent users from knowing your exact location. You can do so by navigating to your settings and under the privacy tab you will see an option to hide your self from the map. Side note: The location displayed on the map are not updated in real time.</BodyText>
            <BodyText style={styles.body_text}>You can also go offline. By going offline that will prevent users from seeing you on the map and list view.</BodyText>
            <BodyText style={styles.body_text}>Remove your account by visiting the remove account tab located in the help center.</BodyText>
        </ScrollView>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20
    },
    header: {
        fontSize: normalize(15),
        alignSelf: 'center',
        marginBottom: 20
    },
    content: {
        paddingBottom: 20
    },
    body_text: {
        fontSize: normalize(10),
        margin: 6,
        marginLeft: 8
    },
    body_header_text: {
        fontSize: normalize(10),
        margin: 6
    },
    header_text: {
        fontSize: normalize(15),
        margin: 5
    }
})