import React from 'react'
import { View, FlatList, ActivityIndicator, Text, TouchableHighlight, Pressable, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { NearByUsersProps, NearUsersRootProps } from '../../services/near_users/tsTypes';
import { NearByListNavProp } from '../navigation/utils';
import { ProfilePage } from '../../utils/variables';
import { ListContainerStyle, colors, buttonsStyles } from '../../utils/styles';
import { ProfileImg } from '../../utils/components';
import InvitationModal from '../modal/InvitationModal';


interface NearByListProps {
    navigation: NearByListNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
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

    handleNearUsersOnPress = (nearUser: NearByUsersProps) => {
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

    renderFlatList = () => {
        const { nearUsers, nearUsersFetched } = this.props
        if (!nearUsersFetched) return <ActivityIndicator />
        if (nearUsers.length < 1) return <Text>No Near By Users</Text>

        const renderActionButton = (item: NearByUsersProps) => {

            if (item.friend) {
                return (
                    <Pressable style={({ pressed }) => pressed ? list_style.content_section_button_primary_pressed : list_style.content_section_button_primary}
                        onPress={() => this.handleMessageOnPress(item)}
                    >
                        <Text style={list_style.content_section_button_primary_text}>Message</Text>
                    </Pressable>)

            }

            if (item.sentInvite) return (
                <Pressable style={buttonsStyles.button_inactive} >
                    <Text style={buttonsStyles.button_inactive_text}>Pending</Text>
                </Pressable>
            )


            return (
                <Pressable style={({ pressed }) => pressed ? list_style.content_section_button_primary_pressed : list_style.content_section_button_primary}
                    onPress={() => this.setState({ showInviteModal: true, sentInviteUser: item })}
                >
                    <Text style={list_style.content_section_button_primary_text}>Invite</Text>
                </Pressable>
            )

        }


        return (
            <View style={{ flex: 1 }}>
                <InvitationModal visible={this.state.showInviteModal} targetUser={this.state.sentInviteUser && this.state.sentInviteUser} handleClose={() => this.setState({ showInviteModal: false, sentInviteUser: undefined })} />
                <FlatList
                    data={this.props.nearUsers}
                    renderItem={({ item, index, separators }) => (
                        <TouchableHighlight
                            key={item.uid}
                            onPress={() => this.handleNearUsersOnPress(item)}
                            underlayColor={colors.secondary}
                            style={list_style.container}
                        >
                            <View style={list_style.content}>
                                <View style={list_style.topLeft}>
                                    <Text style={list_style.topLeft_text}>{item.distance ? item.distance : 0} meters away</Text>
                                </View>
                                <View style={list_style.profile_section}>
                                    <ProfileImg friend={item.friend} />
                                    <View style={list_style.profile_section_text}>
                                        <Text style={list_style.username} numberOfLines={1}>{item.username ? item.username : 'RandomUser'}</Text>
                                        <Text style={list_style.age}>{item.age ? item.age : 0} years old</Text>
                                    </View>
                                </View>
                                <View style={list_style.content_section}>
                                    <Text style={list_style.content_section_text}>{item.bioShort ? item.bioShort : 'nothing ...'}</Text>
                                    <View style={list_style.content_section_buttons}>
                                        {renderActionButton(item)}
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item) => item.uid}
                />
            </View>
        )


    }

    render() {
        return (
            <View style={style.container}>
                {this.renderFlatList()}
            </View>
        )
    }
}

const list_style = ListContainerStyle(colors.primary);

const style = StyleSheet.create({
    container: {
        flex: 1,
    }
})

const mapStateToProps = (state: RootProps) => ({
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched
})

export default connect(mapStateToProps, {})(NearByList);