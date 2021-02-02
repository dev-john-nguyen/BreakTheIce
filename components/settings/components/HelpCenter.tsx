import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BodyText, HeaderText } from '../../utils';

export default () => {
    return (
        <View style={styles.container}>
            <HeaderText>Help Center</HeaderText>
            <View>
                <BodyText>Advice:</BodyText>
                <BodyText>
                    If you feel like a certain individual has been following you through our platform, you can remove yourself from the map view or block the user (go to there profile and seek top right for options) to prevent them from seeing you on their near by users list. Also, you can report them to us directly by emailing us and we will investigate furthur.
            </BodyText>
            </View>

            <View>

            </View>

            <View>
                <BodyText>Email: breaktheice@gmail.com</BodyText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    }
})