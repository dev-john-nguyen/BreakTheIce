import React from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { HomeStackNavigationProp } from '../navigation/utils';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { update_inviter_invitation } from '../../services/invitations/actions';
import { baseStyles } from '../../utils/styles';

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
        const renderInvitationList = () => {
            if (!this.props.invitation.inbound || this.props.invitation.inbound.length < 1) return <Text>No Invitations</Text>;
            console.log(this.props.invitation.inbound);

            return <FlatList
                data={this.props.invitation.inbound}
                renderItem={({ item, index, separators }) => (
                    <View>
                        <TouchableHighlight
                            key={item.uid}
                            onPress={() => this.handleInvitationOnPress(item)}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}
                        >
                            <View>
                                <Text>{item.date.toString()}</Text>
                                <Text>{item.status}</Text>
                                <Text>{item.message}</Text>
                            </View>
                        </TouchableHighlight>
                        <Pressable style={({ pressed }) => pressed ? baseStyles.buttonPressed : baseStyles.button}
                            onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)} >
                            <Text>Accept</Text>
                        </Pressable>
                        <Pressable style={({ pressed }) => pressed ? baseStyles.button : baseStyles.buttonPressed}
                            onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)}>
                            <Text>Deny</Text>
                        </Pressable>
                    </View>
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