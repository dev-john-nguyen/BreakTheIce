import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeaderText, BodyText } from '../../../../utils';
import { normalize } from '../../../../utils/styles';

export default () => (
    <View style={styles.container}>
        <HeaderText style={styles.header}>Contact Us</HeaderText>
        <View style={styles.content}>
            <BodyText style={styles.body_text}>You can reach us at</BodyText>
            <HeaderText style={styles.header_text}>letslinkcontact@gmail.com.</HeaderText>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: normalize(15),
        alignSelf: 'center',
        marginBottom: 20
    },
    content: {
    },
    body_text: {
        fontSize: normalize(10),
        margin: 10
    },
    header_text: {
        fontSize: normalize(12),
        margin: 10
    }
})