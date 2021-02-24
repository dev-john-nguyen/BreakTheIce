import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { HeaderText, BodyText } from '../../../../utils';
import { normalize } from '../../../../utils/styles';

export default () => (
    <View style={styles.container}>
        <HeaderText style={styles.header}>Safety Tips</HeaderText>
        <ScrollView style={styles.content}>
            <HeaderText style={styles.content_header}>Be Cautious about Sharing Personal Information</HeaderText>
            <BodyText style={styles.body_text}>Only share your personal information if you are absolutely sure you can trust the other user. Be aware your profile contains personal information, but be sure to omit anything too confidential. You have complete control over what you want other users to see.</BodyText>

            <HeaderText style={styles.content_header}>Never Share Financial Information or Transfer Money</HeaderText>
            <BodyText style={styles.body_text}>Please don't share any financial information or transfer money to any users through our platform.</BodyText>

            <HeaderText style={styles.content_header}>Use Our Block/Report Feature</HeaderText>
            <BodyText style={styles.body_text}>Please report/block suspicious users through our report/block feature on the app. This will help us take immediate action. All reports are confidential and other users will not be able to identify who reported them, but a user may figure out that they have been blocked by the user.</BodyText>


            <HeaderText style={styles.content_header}>Ask for Verification</HeaderText>
            <BodyText style={styles.body_text}>Please ask for verification before attempting to meet in person/real life. Video/voice call can be an excellent way to ensure that you can trust the user. We also try our best to prevent fake user accounts, but also ask for verification to double check. Lastly, trust your inner tution. If you feel uncomfortable/unsafe, please take immediate action.</BodyText>

            <HeaderText style={styles.content_header}>Emergency</HeaderText>
            <BodyText style={styles.body_text}>Seek help if you feel unsafe! Contact law enforcement if you get into a situation where you feel in danger!</BodyText>
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
    content_header: {
        fontSize: normalize(12),
        marginTop: 10,
    },
    body_text: {
        fontSize: normalize(10),
        margin: 6,
        marginLeft: 8
    },
    header_text: {
        fontSize: normalize(15),
        margin: 5
    }
})