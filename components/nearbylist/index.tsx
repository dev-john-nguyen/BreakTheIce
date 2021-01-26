import React from 'react'
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { NearByUsersProps, NearUsersRootProps } from '../../services/near_users/types';
import { HomeToChatNavProp } from '../navigation/utils/types';
import { ProfilePage } from '../../utils/variables';
import { colors } from '../../utils/styles';
import InvitationModal from '../modal/InvitationModal';
import Preview from '../../utils/components/Preview';
import { update_invitation } from '../../services/invitations/actions';
import { InvitationsDispatchActionProps } from '../../services/invitations/types';
import { UnderlineHeader } from '../../utils/components';


interface NearByListProps {
    navigation: HomeToChatNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    update_invitation: InvitationsDispatchActionProps['update_invitation']
}

interface NearByListStateProps {
    sentInviteUser: NearByUsersProps | undefined;
    showInviteModal: boolean;
}


class NearByList extends React.Component<NearByListProps, NearByListStateProps> {
    constructor(props: NearByListProps) {
        super(props)

        this.state = {
            sentInviteUser: undefined,
            showInviteModal: false
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
            params: { targetUser: nearUser, title: nearUser.username }
        })
    }

    handleSendInvite = (nearUser: NearByUsersProps) => {
        this.setState({ sentInviteUser: nearUser, showInviteModal: true })
    }

    renderFlatList = () => {
        const { nearUsers, nearUsersFetched, update_invitation } = this.props

        if (!nearUsersFetched) return <ActivityIndicator />

        if (nearUsers.length < 1) return <UnderlineHeader text='No Users Near By' styles={{ marginTop: 20 }} />

        return (
            <View style={{ flex: 1 }}>
                <InvitationModal visible={this.state.showInviteModal} targetUser={this.state.sentInviteUser && this.state.sentInviteUser} handleClose={() => this.setState({ showInviteModal: false, sentInviteUser: undefined })} />
                <FlatList
                    data={this.props.nearUsers}
                    renderItem={({ item, index, separators }) => (
                        <Preview
                            nearUser={item}
                            navigation={this.props.navigation}
                            onAction={() => this.handleDirectToProfile(item)}
                            onSendInvite={() => this.handleSendInvite(item)}
                            onInvitationUpdate={update_invitation}
                            containerStyle={styles.preview_container}
                            containerPressStyle={styles.preview_container_pressed}
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
        marginTop: 20,
        borderTopColor: colors.primary,
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    preview_container_pressed: {
        marginTop: 20,
        borderTopColor: colors.primary,
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        backgroundColor: colors.secondary
    }
})

const mapStateToProps = (state: RootProps) => ({
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched
})

export default connect(mapStateToProps, { update_invitation })(NearByList);