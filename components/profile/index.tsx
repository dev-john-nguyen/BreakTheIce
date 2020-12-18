import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, Modal, StyleProp } from 'react-native';
import { HomeScreenRouteProp, HomeStackNavigationProp } from '../navigation/utils';
import { UsersDb } from '../../utils/variables';
import { colors, buttonsStyles, modalStyle } from '../../utils/styles';
import { connect } from 'react-redux';
import { send_invitation } from '../../services/invitations/actions';
import { set_error } from '../../services/utils/actions';
import { InvitationsRootProps } from '../../services/invitations/tsTypes';
import { UserRootStateProps } from '../../services/user/tsTypes';
import { NearUsersRootProps, NearByUsersProps } from '../../services/near_users/tsTypes';
import { FriendsRootProps } from '../../services/friends/tsTypes';
import { RootProps } from '../../services';
import { fireDb } from '../../services/firebase';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg } from '../../utils/svgs';
import InvitationModal from '../modal/InvitationModal';

interface ProfileProps {
    navigation: HomeStackNavigationProp;
    route: HomeScreenRouteProp;
    set_error: (message: string) => void;
    user: UserRootStateProps;
    nearUsers: NearUsersRootProps['all'];
    friends: FriendsRootProps['users'];
    outboundInvitations: InvitationsRootProps['outbound'];
}

interface ProfileUserProps extends UserRootStateProps {
    friend: boolean;
}

//Summary
///Profile shows the whole profile of the user depending on if the user is PRIVATE or not
const Profile = (props: ProfileProps) => {
    const [profileUser, setProfileUser] = useState<NearByUsersProps | undefined>();
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showModalInvite, setShowModalInvite] = useState<boolean>(false);

    useEffect(() => {
        //fetch the profile of the useßr using profileUid that is passed in params
        (async () => {
            if (!props.route.params || !props.route.params.profileUid) {
                props.set_error('User id not found!')
                props.navigation.goBack()
                return;
            }

            const { profileUid } = props.route.params;

            //first search in all users to get the profile
            //reason I can't get from friends is because if the friends updates profile
            //the friendsObj will not update, but rather near_users and profile will only update
            var profileUserObj: NearByUsersProps | undefined;

            for (let i = 0; i < props.nearUsers.length; i++) {
                if (props.nearUsers[i].uid === profileUid) {
                    profileUserObj = { ...props.nearUsers[i] }
                    break;
                }
            }

            //check to see if the profileObj is empty... if it is fetch it from server
            if (!profileUserObj) {
                profileUserObj = await fireDb.collection(UsersDb).doc(profileUid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const docData = doc.data();

                            if (!docData) return undefined;

                            const { location, name, bioShort, bioLong, stateCity, gender, age, isPrivate, username } = docData

                            return {
                                uid: doc.id,
                                username,
                                location,
                                name,
                                bioShort,
                                bioLong,
                                stateCity,
                                gender,
                                age,
                                isPrivate,
                                friend: false,
                                distance: 0,
                                sentInvite: false
                            }

                        } else {
                            return undefined;
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        return undefined;
                    })
            }

            //if the profileUserObj is still empty it meant that we weren't able to find the profile
            //and so set error or not found
            if (!profileUserObj) {
                setErrorMsg("Oops! User not found.")
            } else {
                setProfileUser(profileUserObj)
            }

        })()

    }, [props.route, props.outboundInvitations])

    // useEffect(() => {
    //     //if friends is false then see if an invitation was already sent to this user
    //     //maybe have invitation request implementation so a user can send multiple invitations request
    //     //on separate days

    //     if (!props.route.params || !props.route.params.profileUid) {
    //         props.set_error('User id not found!')
    //         props.navigation.goBack()
    //         return;
    //     }
    //     const { profileUid } = props.route.params;

    //     for (let i = 0; i < props.outboundInvitations.length; i++) {
    //         if (props.outboundInvitations[i].sentTo === profileUid) {
    //             if (profileUser) {
    //                 const updatedProfile: NearByUsersProps = { ...profileUser, sentInvite: true }
    //                 setProfileUser(updatedProfile)
    //                 break;
    //             }
    //         }
    //     }
    // }, [props.outboundInvitations, props.route])

    if (errorMsg) return (<View><Text>{errorMsg}</Text></View>)

    if (!profileUser) return (<View><ActivityIndicator /></View>)

    const baseText = (text: string | number, additionalStyle: Object) => (
        <Text style={[styles.base_text, additionalStyle]}>
            {text}
        </Text>
    )

    const renderHeaderContentButton = () => {
        if (profileUser.friend) return (
            <Pressable onPress={() => console.log('direct to message')}
                style={({ pressed }) => (
                    pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
                )}
            >
                <Text style={buttonsStyles.button_primary_text}>Message</Text>
            </Pressable>
        )

        if (profileUser.sentInvite) return (
            <Pressable style={buttonsStyles.button_inactive}>
                <Text style={buttonsStyles.button_inactive_text}>Pending</Text>
            </Pressable>
        )
        return (
            <Pressable onPress={() => setShowModalInvite(true)}
                style={({ pressed }) => (
                    pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
                )}
            >
                <Text style={buttonsStyles.button_primary_text}>Invite</Text>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <InvitationModal
                visible={showModalInvite && !profileUser.sentInvite && !profileUser.friend}
                user={props.user}
                targetUser={profileUser}
                handleClose={() => setShowModalInvite(false)}
            />
            <View style={styles.header_section}>
                <SvgXml xml={userDefaultSvg} width='100' height='100' fill={colors.primary} />
                <View style={styles.header_content}>
                    <View style={styles.header_content_text}>
                        {baseText(profileUser.name, { fontSize: 24 })}
                        {baseText(`${profileUser.age} years old`, { fontSize: 14 })}
                    </View>
                    {renderHeaderContentButton()}
                </View>
            </View>
            <View style={styles.bio}>
                {baseText(profileUser.bioLong, { fontSize: 12 })}
            </View>
            <View style={styles.timeline}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10
    },
    base_text: {
        color: colors.primary,
        fontWeight: '400'
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
    bioText: {
        fontSize: 12
    },
    timeline: {
        flex: 1,
        padding: 20,
        backgroundColor: 'orange',
    },
    invite_modal: {
        flex: 1,
        backgroundColor: 'green'
    }

})


const mapStateToProps = (state: RootProps) => ({
    outboundInvitations: state.invitations.outbound,
    user: state.user,
    friends: state.friends.users,
    nearUsers: state.nearUsers.all
})

export default connect(mapStateToProps, { send_invitation, set_error })(Profile);