import React from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { InvitationsStackNavigationProp } from '../navigation/utils';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { update_inviter_invitation } from '../../services/invitations/actions';
import { ListContainerStyle, colors, emptyStyles } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, linkSvg } from '../../utils/svgs';

interface Invitations {
    navigation: InvitationsStackNavigationProp;
    invitation: InvitationsRootProps;
    update_inviter_invitation: InvitationsDispatchActionProps['update_inviter_invitation']
}

class Invitations extends React.Component<Invitations> {
    constructor(props: Invitations) {
        super(props)
    }

    handleInvitationOnPress = (inviterObj: InvitationObject) => {
        this.props.navigation.push('Profile', {
            profileUid: inviterObj.sentTo,
            title: inviterObj.sentByUsername
        })
    }

    handleOnStatusUpdatePress = (inviterObj: InvitationObject, updatedStatus: InvitationObject['status']) => {
        this.props.update_inviter_invitation(inviterObj, updatedStatus);
    }

    render() {
        const renderDate = (date: Date) => {
            return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear()
        }

        const renderInvitationList = () => {
            if (!this.props.invitation.inbound || this.props.invitation.inbound.length < 1) return <View style={emptyStyles.container}><Text style={emptyStyles.text}>No Invitations</Text></View>;

            return <FlatList
                data={this.props.invitation.inbound}
                renderItem={({ item, index, separators }) => (
                    <TouchableHighlight
                        onPress={() => this.handleInvitationOnPress(item)}
                        underlayColor={colors.secondary}
                        style={list_style.container}
                    >
                        <View style={list_style.content}>
                            <View style={list_style.topLeft}>
                                <Text style={list_style.topLeft_text}>{item.createdAt ? renderDate(item.createdAt) : '99/99/9999'}</Text>
                            </View>
                            <View style={list_style.profile_section}>
                                <SvgXml xml={userDefaultSvg} width='50' height='50' fill={colors.primary} />
                                <View style={list_style.profile_section_text}>
                                    <Text style={list_style.username}>{item.sentByUsername ? item.sentByUsername : 'UnknownUser'}</Text>
                                    <Text style={list_style.age}>{item.sentByAge ? item.sentByAge : 0} years old</Text>
                                </View>
                            </View>
                            <View style={list_style.content_section}>
                                <Text style={list_style.content_section_text}>{item.message ? item.message : 'No Message...'}</Text>
                                <View style={list_style.content_section_buttons}>
                                    <Pressable style={({ pressed }) => pressed ? list_style.content_section_button_primary_pressed : list_style.content_section_button_primary}
                                        onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)} >
                                        {({ pressed }) => (
                                            <Text style={list_style.content_section_button_primary_text}>{pressed ? 'Accepted' : 'Accept'}</Text>
                                        )}
                                    </Pressable>
                                    <Pressable style={({ pressed }) => pressed ? list_style.content_section_button_secondary_pressed : list_style.content_section_button_secondary}
                                        onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)}>
                                        {({ pressed }) => (
                                            pressed ? <Text style={list_style.content_section_button_secondary_text_pressed}>Denied</Text> :
                                                <Text style={list_style.content_section_button_secondary_text}>Deny</Text>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
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
}
const list_style = ListContainerStyle(colors.primary);

const mapStateToProps = (state: RootProps) => ({
    invitation: state.invitations
})

export default connect(mapStateToProps, { update_inviter_invitation })(Invitations);