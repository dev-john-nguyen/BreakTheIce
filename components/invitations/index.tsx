import React from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { InvitationsStackNavigationProp } from '../navigation/utils';
import { InvitationsRootProps, InvitationObject, InvitationsDispatchActionProps, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { update_invitation_from_invitations } from '../../services/invitations/actions';
import { colors, emptyStyles } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, linkSvg } from '../../utils/svgs';
import { CustomButton } from '../../utils/components';

interface Invitations {
    navigation: InvitationsStackNavigationProp;
    invitation: InvitationsRootProps;
    update_invitation_from_invitations: InvitationsDispatchActionProps['update_invitation_from_invitations']
}

class Invitations extends React.Component<Invitations> {
    constructor(props: Invitations) {
        super(props)
    }

    handleInvitationOnPress = (inviterObj: InvitationObject) => {
        this.props.navigation.push('Profile', {
            profileUid: inviterObj.sentBy,
            title: inviterObj.sentByUsername
        })
    }

    handleOnStatusUpdatePress = (inviterObj: InvitationObject, updatedStatus: InvitationObject['status']) => {
        this.props.update_invitation_from_invitations(inviterObj, updatedStatus);
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
                        style={styles.container}
                    >
                        <View style={styles.content}>
                            <View style={styles.topLeft}>
                                <Text style={styles.topLeft_text}>{item.createdAt ? renderDate(item.createdAt) : '99/99/9999'}</Text>
                            </View>
                            <View style={styles.profile_section}>
                                <SvgXml xml={userDefaultSvg} width='50' height='50' fill={colors.primary} />
                                <View style={styles.profile_section_text}>
                                    <Text style={styles.username}>{item.sentByUsername ? item.sentByUsername : 'UnknownUser'}</Text>
                                    <Text style={styles.age}>{item.sentByAge ? item.sentByAge : 0} years old</Text>
                                </View>
                            </View>
                            <View style={styles.content_section}>
                                <Text style={styles.content_section_text}>{item.message ? item.message : 'No Message...'}</Text>
                                <View style={styles.content_section_buttons}>

                                    <CustomButton type='primary' text='Accept' onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.accepted)} moreStyles={{ marginRight: 10 }} />

                                    <CustomButton type='secondary' text='Deny' onPress={() => this.handleOnStatusUpdatePress(item, InvitationStatusOptions.denied)} />

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

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        marginTop: 20,
        position: 'relative',
    },
    content: {
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 20,
        paddingTop: 20,
    },
    topLeft: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 130,
        paddingBottom: 10
    },
    topLeft_text: {
        fontSize: 8,
        color: colors.primary
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
        paddingTop: 20,
        paddingBottom: 20,
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
        color: colors.secondary,
        margin: 5
    },
    content_section_buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

const mapStateToProps = (state: RootProps) => ({
    invitation: state.invitations
})

export default connect(mapStateToProps, { update_invitation_from_invitations })(Invitations);