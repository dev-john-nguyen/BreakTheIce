import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, buttonsStyles } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import Gallery from '../gallery';
import { Feather } from '@expo/vector-icons';
import ProfileImage from '../components/ProfileImage';

interface MeProps {
    navigation: MeStackNavigationProp;
    user: RootProps['user'];
}

const Me = ({ navigation, user }: MeProps) => {

    const directToEditGallery = () => navigation.navigate('EditGallery')
    const directToFriends = () => navigation.navigate('Friends')

    return (
        <View style={styles.container}>
            <View style={styles.username_section}>
                <View style={styles.username_container}>
                    <Text style={styles.username_text}>{user.username}</Text>
                    <View style={styles.username_underline} />
                </View>
            </View>
            <View style={styles.header_section}>
                <ProfileImage image={user.profileImg} size='large' />
                <View style={styles.header_content}>
                    <View style={styles.header_content_text}>
                        <Text style={[styles.base_text, { fontSize: 24 }]}>
                            {user.name}
                        </Text>
                        <Text style={[styles.base_text, { fontSize: 14 }]}>
                            {user.age} years old
                        </Text>

                    </View>
                    <Pressable onPress={directToFriends}
                        style={({ pressed }) => (
                            pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
                        )}
                    >
                        <Text style={buttonsStyles.button_primary_text}>Friends</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.bio}>
                <Text style={[styles.base_text, { fontSize: 12 }]}>
                    {user.bioLong}
                </Text>
            </View>
            <Pressable onPress={directToEditGallery} style={styles.edit_icon}>
                {({ pressed }) => <Feather name="edit" size={24} color={pressed ? colors.secondary : colors.primary} />}
            </Pressable>
            <Gallery gallery={user.gallery} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: 0,
        padding: 10
    },
    username_section: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    username_container: {
        position: 'relative'
    },
    username_text: {
        fontWeight: 'bold',
        fontSize: 25,
        letterSpacing: 2,
        position: 'relative',
        bottom: 5,
        color: colors.primary
    },
    username_underline: {
        position: 'absolute',
        backgroundColor: colors.primary,
        opacity: .5,
        height: 15,
        borderRadius: 20,
        bottom: 3,
        alignSelf: 'center',
        width: '120%'
    },
    base_text: {
        color: colors.primary,
        fontWeight: '400',
        letterSpacing: .2
    },
    header_section: {
        flexBasis: 'auto',
        alignItems: "center",
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '20%'
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
    bio: {
        flexBasis: 'auto',
        padding: 20,

    },
    edit_icon: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginRight: 40
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Me);