import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../utils/styles';
import { MeStackNavigationProp } from '../../navigation/utils/types';
import Gallery from '../../gallery';
import ProfileImage from '../../../utils/components/ProfileImage';
import { CustomButton, HeaderText, BodyText, Icon } from '../../../utils/components';
import { TopProfileBackground } from '../../../utils/svgs';
import { ProfileUserProps } from '../../../services/profile/types';

interface ProfileProps {
    navigation: MeStackNavigationProp;
    user: ProfileUserProps;
}

const Profile = ({ navigation, user }: ProfileProps) => {

    const directToFriends = () => navigation.navigate('Friends')

    return (
        <>
            <TopProfileBackground style={styles.header_background} height={'180'} width={Math.round(Dimensions.get('window').width).toString()} />
            <View style={styles.container}>
                <View style={styles.header_section}>

                    <ProfileImage image={user.profileImg} size='large' />

                    <View style={styles.header_section_content}>
                        <View style={styles.header_content_text}>
                            <HeaderText text={user.name} styles={styles.header_text} />
                            <BodyText text={`${user.age} years old`} styles={styles.sub_header_text} />
                        </View>
                        <CustomButton onPress={directToFriends} text='Friends' type='primary' moreStyles={styles.header_button} />
                    </View>
                </View>

                <View style={styles.bio}>
                    <BodyText text={user.bioLong} styles={styles.bio_text} />
                </View>
                <Gallery gallery={user.gallery} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 80
    },
    header_background: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    header_section: {
        marginTop: 30,
        alignItems: 'center'
    },
    header_section_content: {
        alignItems: 'center'
    },
    header_content_text: {
        alignItems: 'center'
    },
    header_text: {
        marginTop: 10,
        color: colors.primary,
        fontSize: 18
    },
    header_button: {
        marginTop: 10
    },
    sub_header_text: {
        fontSize: 14,
        color: colors.primary
    },
    bio: {
        paddingTop: 20,
        paddingBottom: 20,
        padding: 10
    },
    bio_text: {
        fontSize: 12,
        color: colors.primary,
        lineHeight: 15
    },
    edit_icon: {
        alignSelf: 'flex-end',
        padding: 10
    }
})

export default Profile;