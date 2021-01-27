import React from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { InvitationsStackNavigationProp } from '../navigation/utils/types';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/types';
import { update_invitation_from_invitations } from '../../services/invitations/actions';
import { colors } from '../../utils/styles';
import { UnderlineHeader } from '../../utils/components';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { renderDate } from '../chat/utils';
import ProfileImage from '../profile/components/ProfileImage';

interface Invitations {
    navigation: InvitationsStackNavigationProp;
    invitation: InvitationsRootProps;
    update_invitation_from_invitations: InvitationsDispatchActionProps['update_invitation_from_invitations']
}

const Invitations = ({ navigation, invitation, update_invitation_from_invitations }: Invitations) => {


    const handleDirectToProfile = (inviterObj: InvitationObject) => {
        navigation.push('Profile', {
            profileUid: inviterObj.sentBy.uid,
            title: inviterObj.sentBy.username
        })
    }

    const handleOnStatusUpdatePress = (inviterObj: InvitationObject, updatedStatus: InvitationObject['status']) => {
        update_invitation_from_invitations(inviterObj, updatedStatus);
    }

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
        const trans = progress.interpolate({
            inputRange: [0, .4, .5, 1],
            outputRange: [0, -10, -120, -320],
        });

        return (
            <View style={styles.rightAction}>
                <Animated.Text style={[
                    styles.actionText,
                    {
                        transform: [{ translateX: trans }]
                    }
                ]}>
                    Deny
                    </Animated.Text>
            </View>
        )
    }

    const renderLeftActions = (progress: Animated.AnimatedInterpolation) => {
        const trans = progress.interpolate({
            inputRange: [0, .4, .5, 1],
            outputRange: [0, 10, 120, 320],
        });

        return (
            <View style={styles.leftAction}>
                <Animated.Text style={[
                    styles.actionText,
                    {
                        transform: [{ translateX: trans }]
                    }
                ]}>
                    Accept
                    </Animated.Text>
            </View>
        )
    }

    const renderInvitationList = () => {
        if (!invitation.inbound || invitation.inbound.length < 1) return <UnderlineHeader text='No Invitations Found' styles={{ marginTop: 20 }} />;

        return <FlatList
            data={invitation.inbound}
            renderItem={({ item, index, separators }) => (
                <Swipeable
                    renderRightActions={renderRightActions}
                    renderLeftActions={renderLeftActions}
                    onSwipeableRightOpen={() => handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)}
                    onSwipeableLeftOpen={() => handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)}
                    containerStyle={styles.container}
                >
                    <Pressable style={styles.content} onPress={() => alert('swipe youngblod!')}>
                        <View style={styles.profile_section}>
                            <ProfileImage size='regular' image={item.sentBy.profileImg} onImagePress={() => handleDirectToProfile(item)} />
                            <View style={styles.profile_section_text}>
                                <Text style={styles.username}>{item.sentBy.username ? item.sentBy.username : 'UnknownUser'}</Text>
                            </View>
                        </View>
                        <View style={styles.content_section}>
                            <Text style={styles.content_section_text}>{item.message ? item.message : 'No Message...'}</Text>
                            <View style={styles.content_section_small}>
                                <Text style={styles.content_section_small_text}>{item.createdAt && renderDate(item.createdAt)}</Text>
                            </View>
                        </View>
                    </Pressable>
                </Swipeable>
            )}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />

    }


    return (
        <View style={{ flex: 1 }}>
            {renderInvitationList()}
        </View>
    )

}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    actionText: {
        color: colors.white,
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.red,
    },
    container: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        position: 'relative',
        marginBottom: 20
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profile_section_text: {
        bottom: 5
    },
    username: {
        marginTop: 15,
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        overflow: 'visible'
    },
    age: {
        fontSize: 12,
        color: colors.primary,
        textAlign: 'center'
    },
    content_section: {
        flex: 1,
        justifyContent: 'space-evenly',
        paddingLeft: 20,
        paddingRight: 10,
        alignSelf: 'center'
    },
    content_section_text: {
        fontSize: 12,
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    content_section_small: {
        alignSelf: 'flex-end',
        flexDirection: 'row'
    },
    content_section_small_text: {
        fontSize: 8,
        color: colors.primary,
        margin: 5
    }
})

const mapStateToProps = (state: RootProps) => ({
    invitation: state.invitations
})

export default connect(mapStateToProps, { update_invitation_from_invitations })(Invitations);