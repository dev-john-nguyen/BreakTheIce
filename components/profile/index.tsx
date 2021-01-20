import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ProfileScreenRouteProp, RootBottomParamList, HomeStackNavigationProp } from '../navigation/utils';
import { colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { send_invitation, update_invitation } from '../../services/invitations/actions';
import { InvitationsRootProps, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { UserRootStateProps } from '../../services/user/types';
import { NearUsersRootProps } from '../../services/near_users/types';
import { FriendsRootProps, FriendDispatchActionProps } from '../../services/friends/tsTypes';
import { RootProps } from '../../services';
import InvitationModal from '../modal/InvitationModal';
import { set_current_profile } from '../../services/profile/actions';
import { ProfileDispatchActionProps, ProfileUserProps, ProfileRootProps } from '../../services/profile/tsTypes';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import Gallery from '../gallery';
import ProfileImage from '../components/ProfileImage';
import RespondButton from '../components/RespondButton';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ProfileHeaderRight from './components/ProfileHeaderRight';
import { unfriend_user } from '../../services/friends/actions';
import { set_banner } from '../../services/utils/actions';
import { CustomButton } from '../../utils/components';

interface ProfileProps {
    navigation: BottomTabNavigationProp<RootBottomParamList, 'Home'> & HomeStackNavigationProp
    route: ProfileScreenRouteProp;
    user: UserRootStateProps;
    nearUsers: NearUsersRootProps['all'];
    friends: FriendsRootProps['users'];
    profile: ProfileRootProps;
    outboundInvitations: InvitationsRootProps['outbound'];
    set_current_profile: ProfileDispatchActionProps['set_current_profile'];
    update_invitation: InvitationsDispatchActionProps['update_invitation'];
    unfriend_user: FriendDispatchActionProps['unfriend_user'];
    set_banner: UtilsDispatchActionProps['set_banner'];
}

//Summary
///Profile shows the whole profile of the user depending on if the user is PRIVATE or not
const Profile = (props: ProfileProps) => {
    const [profileUser, setProfileUser] = useState<ProfileUserProps>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [showModalInvite, setShowModalInvite] = useState<boolean>(false);
    const [inviteStatusLoading, setInviteStatusLoading] = useState<boolean>(false);


    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <ProfileHeaderRight handleUnfriendUser={handleUnfriendUser} block_user={() => console.log('blocking..')} />
        })
    }, [profileUser, props.unfriend_user])

    const handleUnfriendUser = async () => {
        if (!profileUser) return
        return await props.unfriend_user(profileUser.uid)
    }

    useEffect(() => {
        //set redux state profile
        if (!props.route.params || !props.route.params.profileUid) {
            props.set_banner("Sorry, couldn't find the user information.", 'error')
            props.navigation.goBack()
            return;
        }

        var mount = true;

        props.set_current_profile(props.route.params.profileUid)
            .then((resProfile) => {
                if (resProfile) {
                    mount && setProfileUser(resProfile)
                } else {
                    mount && setNotFound(true);
                }
            })
            .catch(err => {
                console.log(err)
                mount && setNotFound(true)
            })

        //remove on unmount
        //note: the fetched profile should have updated redux near_users state
        return () => { mount = false };

    }, [props.route, props.outboundInvitations, props.profile.history])

    const handleInvitationUpdate = async (status: InvitationStatusOptions) => {
        if (!profileUser) return;

        return await props.update_invitation(profileUser.uid, status)
    }

    const directToMessage = () => {
        if (!profileUser) return;

        const { uid, username } = profileUser;

        const targetUser = { uid, username }

        props.navigation.navigate('Chat', {
            screen: 'Message',
            initial: false,
            params: {
                targetUser,
                title: targetUser.username
            }
        })
    }

    const renderHeaderContentButton = () => {
        if (!profileUser) return;

        if (profileUser.friend) return <CustomButton onPress={directToMessage} text='Message' type='primary' />

        if (profileUser.sentInvite) return <CustomButton type='disabled' text='Pending' />

        if (profileUser.receivedInvite) return <RespondButton handleInvitationUpdate={handleInvitationUpdate}
            setLoading={setInviteStatusLoading}
            loading={inviteStatusLoading}
        />

        return <CustomButton onPress={() => setShowModalInvite(true)} text='Invite' type='primary' />

    }

    const baseText = (text: string | number, additionalStyle: Object) => (
        <Text style={[styles.base_text, additionalStyle]}>
            {text}
        </Text>
    )

    if (notFound) return (<View><Text>Not Found</Text></View>)

    if (!profileUser) return (<View><ActivityIndicator /></View>)

    return (
        <View style={styles.container}>
            <InvitationModal
                visible={showModalInvite && !profileUser.sentInvite && !profileUser.friend}
                targetUser={profileUser}
                handleClose={() => setShowModalInvite(false)}
            />
            <View style={styles.header_section}>
                <ProfileImage image={profileUser.profileImg} size='large' />
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
            <Gallery gallery={profileUser.gallery} nearByUser={true} />
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
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '20%'
    },
    header_content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 10
    },
    header_content_text: {
        marginBottom: 10,
        alignItems: 'center'
    },
    bio: {
        flexBasis: 'auto',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10
    },
    bioText: {
        fontSize: 12
    },
    invite_modal: {
        flex: 1,
        backgroundColor: 'green'
    },
    invitation_buttons: {
        flexDirection: 'row'
    }
})


const mapStateToProps = (state: RootProps) => ({
    outboundInvitations: state.invitations.outbound,
    user: state.user,
    friends: state.friends.users,
    nearUsers: state.nearUsers.all,
    profile: state.profile
})

export default connect(mapStateToProps, { send_invitation, set_current_profile, update_invitation, unfriend_user, set_banner })(Profile);