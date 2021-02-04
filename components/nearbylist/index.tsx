import React from 'react'
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { NearByUsersProps, NearUsersRootProps } from '../../services/near_users/types';
import { HomeToChatNavProp } from '../navigation/utils/types';
import { ProfilePage } from '../../utils/variables';
import { colors } from '../utils/styles';
import InvitationModal from '../modal/invitation';
import Preview from '../profile/components/Preview';
import { update_invitation } from '../../services/invitations/actions';
import { InvitationsDispatchActionProps } from '../../services/invitations/types';
import { UnderlineHeader } from '../utils';
import Empty from '../utils/components/Empty';
import RespondModel from '../modal/respond';


interface NearByListProps {
    navigation: HomeToChatNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    update_invitation: InvitationsDispatchActionProps['update_invitation']
}

interface NearByListStateProps {
    inviteUser: NearByUsersProps | undefined;
    respondUser: NearByUsersProps | undefined;
}


class NearByList extends React.Component<NearByListProps, NearByListStateProps> {
    constructor(props: NearByListProps) {
        super(props)

        this.state = {
            inviteUser: undefined,
            respondUser: undefined
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

    renderFlatList = () => {
        const { nearUsers, nearUsersFetched, update_invitation } = this.props

        if (!nearUsersFetched) return <ActivityIndicator />

        if (nearUsers.length < 1) return <Empty style={{ marginTop: 20 }}>No Users Nearby</Empty>

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

export default connect(mapStateToProps, { update_invitation })(NearByList);