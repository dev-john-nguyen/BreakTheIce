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

            <HeaderText style={styles.content_header}>Information Given To Us</HeaderText>

            <BodyText style={styles.body_text}>When you create an account, you provide us with at least your phone number for your login credentials, name, and age.</BodyText>
            <BodyText style={styles.body_text}>When you complete your profile, you can share with us additional information, such as details on your personality, lifestyle, interests, and other details about you, as well as photos. To add photos, you may allow us to access your photo album. By choosing to provide this information, you consent to our processing of that information.</BodyText>
            <BodyText style={styles.body_text}>If you contact our customer service team, we collect the information you give us during the interaction.</BodyText>
            <BodyText style={styles.body_text}>We process your chats with other users as well as the content you publish, as part of the services</BodyText>


            <HeaderText style={styles.content_header}>Information Collected When you Use Our Services</HeaderText>

            <BodyText style={styles.body_text}>We collect information about your activities on our services, such as the date and time you logged in.</BodyText>
            <BodyText style={styles.body_text}>We collect information from the device(s) you use to access our services, including a device ID, time zones, cookies, and other technologies that may uniquely identify your device.</BodyText>
            <BodyText style={styles.body_text}>We collect if given permission, your precise geolocation (latitude and longitude). If you decline permission for us to access your geolocation, we will not collect it.</BodyText>


            <HeaderText style={styles.content_header}>We Use The Information</HeaderText>

            <BodyText style={styles.body_text}>To administer your account and provide our services to you</BodyText>
            <BodyText style={styles.body_text}>To help you connect with other users</BodyText>
            <BodyText style={styles.body_text}>To improve our services and develop new ones</BodyText>
            <BodyText style={styles.body_text}>To prevent, detect and fight fraud or other illegal or unauthorized activities</BodyText>
            <BodyText style={styles.body_text}>To ensure legal compliance</BodyText>


            <HeaderText style={styles.content_header}>How We Share Information</HeaderText>

            <BodyText style={styles.body_text}>With other people, we share your information that you decide to publish, such as your name, age, lifestyle, interest, and other content, as well as any photos you decide to publish. Please be careful with your information and make sure that the content you share is stuff that you are okay with other users seeing.</BodyText>
            <BodyText style={styles.body_text}>With our service providers, we share information to help us operate and improve our services. These third parties assist us with hosting, maintenance, security, and location tracking.</BodyText>
            <BodyText style={styles.body_text}>When required by law and/or to enforce legal rights, we may disclose your information if reasonably necessary to comply with the legal process.</BodyText>
            <BodyText style={styles.body_text}>With your consent and/or request, we may share information that you consent to share with third parties.</BodyText>


            <HeaderText style={styles.content_header}>Your Rights</HeaderText>

            <BodyText style={styles.body_text}>Tools and account settings that help you to access, rectify or delete information that you provided to us and that’s associated with your account directly within the service.</BodyText>
            <BodyText style={styles.body_text}>Mobile platforms have permission systems for specific types of device data and notifications, such as phone book and location services as well as push notifications.</BodyText>
            <BodyText style={styles.body_text}>You can delete your account by using the corresponding functionality directly on the service.</BodyText>
            <BodyText style={styles.body_text}>You can stop all information collection by an app by uninstalling it using the standard uninstall process for your device</BodyText>


            <HeaderText style={styles.content_header}>Age Restrictions</HeaderText>
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