import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { HeaderText, BodyText } from '../../../../utils';
import { normalize, colors } from '../../../../utils/styles';
import { WebView } from 'react-native-webview';

export default () => (
    <View style={styles.container}>
        <HeaderText style={styles.header}>Privacy Policy</HeaderText>
        <ScrollView style={styles.content}>
            <HeaderText style={styles.content_header}>Our Commitment To You</HeaderText>
            <BodyText style={styles.body_text}>Your privacy is a top priority. Your privacy is at the core of the way we design and build the services and products you know and love so that you can fully trust them and focus on building meaningful connections.</BodyText>

            <HeaderText style={styles.content_header}>Information We Collect</HeaderText>
            <BodyText style={styles.body_text}>We need certain information about you that we collect to help you build and develop connections, such as profile details and your location.</BodyText>

            <HeaderText style={styles.content_header}>Information Collected </HeaderText>
            <BodyText style={styles.body_text}>When you use our services, of course with your conset, we collect your precise geolocation to help us identify users near you, so you can meet and build meaningful connections. We also collect information about your activity on our services, for instance how you use them (e.g., date and time you logged in)</BodyText>

            <HeaderText style={styles.content_header}>Information Collected </HeaderText>
            <BodyText style={styles.body_text}>When you use our services, of course with your conset, we collect your precise geolocation to help us identify users near you, so you can meet and build meaningful connections. We also collect information about your activity on our services, for instance how you use them (e.g., date and time you logged in)</BodyText>

            <HeaderText style={styles.content_header}>What We Do With Your Information </HeaderText>
            <BodyText style={styles.body_text}>To administer your account and provide our services to you</BodyText>
            <BodyText style={styles.body_text}>To help you connect with other users</BodyText>
            <BodyText style={styles.body_text}>To improve our services and develop new ones</BodyText>
            <BodyText style={styles.body_text}>To prevent, detect and fight fraud or other illegal or unauthorized activities</BodyText>


            <HeaderText style={styles.content_header}>LetsLink Has The Right</HeaderText>
            <BodyText style={styles.body_text}>To administer your account and provide our services to you</BodyText>
            <BodyText style={styles.body_text}>To help you connect with other users</BodyText>
            <BodyText style={styles.body_text}>To improve our services and develop new ones</BodyText>
            <BodyText style={styles.body_text}>To prevent, detect and fight fraud or other illegal or unauthorized activities</BodyText>


            <HeaderText style={styles.content_header}>Your Rights</HeaderText>
            <BodyText style={styles.body_text}>Tools and account settings that help you to access, rectify or delete information that you provided to us and that’s associated with your account directly within the service</BodyText>
            <BodyText style={styles.body_text}>Mobile platforms have permission systems for specific types of device data and notifications, such as phone book and location services as well as push notifications</BodyText>
            <BodyText style={styles.body_text}>You can delete your account by using the corresponding functionality directly on the service</BodyText>
            <BodyText style={styles.body_text}>You can stop all information collection by an app by uninstalling it using the standard uninstall process for your device</BodyText>

            <HeaderText style={styles.content_header}>Age Restrictions </HeaderText>
            <BodyText style={styles.body_text}>Our services are restricted to users who are 18 years of age or older. We do not permit users under the age of 18 on our platform and we do not knowingly collect personal information from anyone under the age of 18 years old. Please report any unauthorized users.</BodyText>

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