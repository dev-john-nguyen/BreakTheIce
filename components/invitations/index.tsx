import React from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { HomeStackNavigationProp } from '../navigation/utils';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { update_inviter_invitation } from '../../services/invitations/actions';
import { ListContainerStyle, colors, buttonsStyles } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, linkSvg } from '../../utils/svgs';

interface Invitations {
    navigation: any;
    invitation: InvitationsRootProps;
    update_inviter_invitation: InvitationsDispatchActionProps['update_inviter_invitation']
}

class Invitations extends React.Component<Invitations> {
    constructor(props: Invitations) {
        super(props)


    }

    handleInvitationOnPress = (inviterObj: InvitationObject) => {
        // this.props.navigation.navigate('Home', {
        //     screen: 'Profile',
        //     params: {
        //         profileUid: inviterObj.uid
        //     }
        // })
        this.props.navigation.push('Profile', { profileUid: inviterObj.uid })
    }

    handleOnStatusUpdatePress = (inviterObj: InvitationObject, status: InvitationObject['status']) => {
        this.props.update_inviter_invitation(inviterObj.uid, status);
    }

    render() {
        const renderDate = (date: Date) => {
            console.log(date)
            return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear()
        }

        const renderInvitationList = () => {
            if (!this.props.invitation.inbound || this.props.invitation.inbound.length < 1) return <Text>No Invitations</Text>;

            return <FlatList
                data={this.props.invitation.inbound}
                renderItem={({ item, index, separators }) => (
                    <TouchableHighlight
                        key={item.uid}
                        onPress={() => this.handleInvitationOnPress(item)}
                        underlayColor={colors.secondary}
                        style={ListContainerStyle.container}
                    >
                        <View style={ListContainerStyle.content}>
                            <View style={ListContainerStyle.topLeft}>
                                <Text style={ListContainerStyle.topLeft_text}>{item.date ? renderDate(item.date) : '99/99/9999'}</Text>
                            </View>
                            <View style={ListContainerStyle.profile_section}>
                                <SvgXml xml={userDefaultSvg} width='50' height='50' fill={colors.primary} />
                                <View>
                                    <Text style={ListContainerStyle.username}>RandomUser</Text>
                                    <Text style={ListContainerStyle.age}>26 years old</Text>
                                </View>
                            </View>
                            <View style={ListContainerStyle.content_section}>
                                <Text style={ListContainerStyle.content_section_text}>{item.message ? item.message : 'No Message...'}</Text>
                                <View style={ListContainerStyle.content_section_buttons}>
                                    <Pressable style={({ pressed }) => pressed ? ListContainerStyle.content_section_button_primary_pressed : ListContainerStyle.content_section_button_primary}
                                        onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)} >
                                        {({ pressed }) => (
                                            <Text style={ListContainerStyle.content_section_button_primary_text}>{pressed ? 'Accepted' : 'Accept'}</Text>
                                        )}
                                    </Pressable>
                                    <Pressable style={({ pressed }) => pressed ? ListContainerStyle.content_section_button_secondary_pressed : ListContainerStyle.content_section_button_secondary}
                                        onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)}>
                                        {({ pressed }) => (
                                            pressed ? <Text style={ListContainerStyle.content_section_button_secondary_text_pressed}>Denied</Text> :
                                                <Text style={ListContainerStyle.content_section_button_secondary_text}>Deny</Text>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
                keyExtractor={(item) => item.uid}
            />

        }


        return (
            <View style={style.container}>
                {renderInvitationList()}
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    }
})

const mapStateToProps = (state: RootProps) => ({
    invitation: state.invitations
})

export default connect(mapStateToProps, { update_inviter_invitation })(Invitations);