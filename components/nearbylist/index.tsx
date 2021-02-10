import React from 'react'
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { NearByUsersProps, NearUsersRootProps, NearUsersDispatchActionProps } from '../../services/near_users/types';
import { HomeToChatNavProp } from '../navigation/utils/types';
import { ProfilePage } from '../../utils/variables';
import InvitationModal from '../modal/invitation';
import Preview from '../profile/components/Preview';
import { update_invitation } from '../../services/invitations/actions';
import { InvitationsDispatchActionProps } from '../../services/invitations/types';
import Empty from '../utils/components/Empty';
import RespondModel from '../modal/respond';
import { refresh_near_users } from '../../services/near_users/actions';
import { colors } from '../utils/styles';


interface NearByListProps {
    navigation: HomeToChatNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    update_invitation: InvitationsDispatchActionProps['update_invitation']
    refresh_near_users: NearUsersDispatchActionProps['refresh_near_users']
}

interface NearByListStateProps {
    inviteUser: NearByUsersProps | undefined;
    respondUser: NearByUsersProps | undefined;
    refreshing: boolean;
}


class NearByList extends React.Component<NearByListProps, NearByListStateProps> {
    constructor(props: NearByListProps) {
        super(props)

        this.state = {
            inviteUser: undefined,
            respondUser: undefined,
            refreshing: false
        }
    }

    handleDirectToProfile = (nearUser: NearByUsersProps) => {
        this.props.navigation.navigate(ProfilePage, {
            profileUid: nearUser.uid,
            title: nearUser.username
        })
    }

    handleMessageOnPress = (nearUser: NearByUsersProps) => {
        this.props.navigation.navigate('Chat', {
            screen: 'Message',
            initial: false,
            params: { targetUser: nearUser }
        })
    }

    handleOnSendInvite = (nearUser: NearByUsersProps) => { this.setState({ inviteUser: nearUser }) }

    handleOnRespond = (nearUser: NearByUsersProps) => { this.setState({ respondUser: nearUser }) }

    handleOnInviteClose = () => { this.setState({ inviteUser: undefined }) }

    handleOnRespondClose = () => { this.setState({ respondUser: undefined }) }

    handleOnRefresh = async () => {
        this.setState({ refreshing: true })

        try {
            await this.props.refresh_near_users()
        } catch (err) {
            console.log(err)
        }

        this.setState({ refreshing: false })
    }

    renderFlatList = () => {
        const { nearUsers, nearUsersFetched, update_invitation } = this.props

        if (!nearUsersFetched) return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size='large' color={colors.primary} />
            </View>
        )

        return (
            <View style={{ flex: 1 }}>
                <InvitationModal
                    visible={!!this.state.inviteUser}
                    targetUser={this.state.inviteUser}
                    handleClose={this.handleOnInviteClose}
                />
                <RespondModel
                    visible={!!this.state.respondUser}
                    targetUser={this.state.respondUser}
                    handleClose={this.handleOnRespondClose}
                />
                <FlatList
                    ListEmptyComponent={() => (
                        <Empty style={{ marginTop: 50 }}>No Users Nearby</Empty>
                    )}
                    data={this.props.nearUsers}
                    renderItem={({ item, index, separators }) => (
                        <Preview
                            nearUser={item}
                            navigation={this.props.navigation}
                            onAction={() => this.handleDirectToProfile(item)}
                            onSendInvite={() => this.handleOnSendInvite(item)}
                            onRespond={() => this.handleOnRespond(item)}
                            onInvitationUpdate={update_invitation}
                            containerStyle={styles.preview_container}
                            listView={true}
                        />
                    )}
                    keyExtractor={(item) => item.uid}
                    contentContainerStyle={styles.flat_list}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleOnRefresh}
                            tintColor={colors.primary}
                        />
                    }
                />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderFlatList()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flat_list: {
        paddingBottom: 20
    },
    preview_container: {
        marginBottom: 20
    }
})

const mapStateToProps = (state: RootProps) => ({
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched
})

export default connect(mapStateToProps, { update_invitation, refresh_near_users })(NearByList);