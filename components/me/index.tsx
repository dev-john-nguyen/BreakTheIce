import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { colors } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils/types';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import Gallery from '../gallery';
import { Feather } from '@expo/vector-icons';
import ProfileImage from '../../utils/components/ProfileImage';
import { CustomButton, HeaderText, BodyText, Icon } from '../../utils/components';

interface MeProps {
    navigation: MeStackNavigationProp;
    user: RootProps['user'];
}

const Me = ({ navigation, user }: MeProps) => {

    const directToEditGallery = () => navigation.navigate('EditGallery')
    const directToFriends = () => navigation.navigate('Friends')

    return (
        <ImageBackground source={require('../../utils/ice.jpg')} style={styles.background_image}>
            <View style={styles.container}>
                <View style={styles.header_section}>
                    <View style={styles.profile_image}>
                        <ProfileImage image={user.profileImg} size='large' />
                    </View>
                    <View style={styles.header_content}>
                        <View style={styles.header_content_text}>
                            <HeaderText text={user.name} styles={styles.header_text} />
                            <BodyText text={`${user.age} years old`} styles={styles.sub_header_text} />
                        </View>
                        <CustomButton onPress={directToFriends} text='Friends' type='primary' />
                    </View>
                </View>
                <View style={styles.bio}>
                    <BodyText text={user.bioLong} styles={styles.bio_text} />
                </View>
                <Icon
                    type='edit'
                    size={24}
                    color={colors.primary}
                    pressColor={colors.secondary}
                    onPress={directToEditGallery}
                    style={styles.edit_icon}
                />
                <Gallery gallery={user.gallery} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: `rgba(${colors.lightWhite_rgb},.9)`
    },
    background_image: {
        flex: 1
    },
    header_section: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    header_text: {
        color: colors.primary,
        fontSize: 18
    },
    header_content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    header_content_text: {
        marginBottom: 10,
        alignItems: 'center'
    },
    profile_image: {
        flex: 1
    },
    sub_header_text: {
        fontSize: 14,
        color: colors.primary
    },
    bio: {
        flexBasis: 'auto',
        padding: 10,
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

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Me);