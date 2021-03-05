import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { HeaderText, BodyText } from '../../../../utils';
import { normalize } from '../../../../utils/styles';

export default () => (
    <View style={styles.container}>
        <HeaderText style={styles.header}>Community Guidelines</HeaderText>
        <ScrollView style={styles.content}>
            <HeaderText style={styles.content_header}>Upload Your Own Content</HeaderText>
            <BodyText style={styles.body_text}>We take copyrights seriously. Please post content that you have the rights to upload.</BodyText>

            <HeaderText style={styles.content_header}>Respect All Users</HeaderText>
            <BodyText style={styles.body_text}>Please take into consideration the other users and their beliefs, interests, and property. We all want a safe and open environment to meet new poeple. So with that being said, please be aware of how you treat other users.</BodyText>



            <HeaderText style={styles.content_header}>Avoid Posting Explicit Content</HeaderText>
            <BodyText style={styles.body_text}>No pornographic material.</BodyText>
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
        marginBottom: 10
    },
    content: {
        paddingBottom: 20
    },
    content_header: {
        fontSize: normalize(12),
        marginTop: 10,

    },
    body_text: {
        fontSize: normalize(10),
        margin: 6
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