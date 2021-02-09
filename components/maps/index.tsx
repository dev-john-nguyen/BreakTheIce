import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { ProfilePage } from '../../utils/variables';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { validate_near_users, refresh_near_users } from '../../services/near_users/actions';
import { NearUsersRootProps, NearByUsersProps, NearUsersDispatchActionProps } from '../../services/near_users/types';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { HomeToChatNavProp } from '../navigation/utils/types';
import { CustomButton, Icon } from '../utils';
import Preview from '../profile/components/Preview';
import InvitationModal from '../modal/invitation';
import ProfileImage from '../profile/components/ProfileImage';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../utils/styles';
import { InvitationsDispatchActionProps } from '../../services/invitations/types';
import { update_invitation } from '../../services/invitations/actions';
import RespondModal from '../modal/respond';
import UpdateStatus from '../me/components/UpdateStatus';
import { update_status_message } from '../../services/user/actions';

interface RegionProps {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface MapStateProps {
    region: RegionProps;
    selectedNearUser: NearByUsersProps | null;
    previewUser: NearByUsersProps | null;
    previewMe: boolean;
    sendInvite: boolean;
    showRespond: boolean;
}

interface MapsProps {
    navigation: HomeToChatNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    allUsers: NearUsersRootProps['all'];
    user: UserRootStateProps;
    update_invitation: InvitationsDispatchActionProps['update_invitation']
    refresh_near_users: NearUsersDispatchActionProps['refresh_near_users']
    update_status_message: UserDispatchActionsProps['update_status_message']
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0020;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//location and ctryStateCity are checked are parent element so this won't render unless those are checked
class Maps extends React.Component<MapsProps, MapStateProps> {

    constructor(props: MapsProps) {
        super(props);

        const initRegion = {
            latitude: props.user.location.coords.latitude,
            longitude: props.user.location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }

        //handle clean up async actions
        // this._isMounted = false;
        // this._initLocation = false;
        this.state = {
            region: initRegion,
            selectedNearUser: null,
            previewMe: false,
            previewUser: null,
            sendInvite: false,
            showRespond: false
        }
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerTitle: () => (
                <CustomButton text="My Location" type='secondary' onPress={this.handleOnMyLocationPress} />
            ),
            headerLeft: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Icon type='refresh-ccw' style={{ marginLeft: 20 }} size={25} color={colors.primary} pressColor={colors.secondary} onPress={this.props.refresh_near_users} />

                    {
                        !this.props.user.hideOnMap &&
                        (
                            <FontAwesome name="user-secret" size={30} color={colors.primary} style={{ marginLeft: 20 }} />
                        )
                    }
                </View>

            )
        })
    }

    componentWillUnmount() {
        this.props.navigation.setOptions({
            headerTitle: undefined,
            headerLeft: undefined
        })
    }

    handleNearUsersOnPress = (nearUsers: NearByUsersProps) => {
        this.props.navigation.navigate(ProfilePage, {
            profileUid: nearUsers.uid,
            title: nearUsers.username
        })
    }

    handleOnMyLocationPress = () => {
        if (this.props.user.location) {
            this.setState(
                {
                    region: {
                        latitude: this.props.user.location.coords.latitude,
                        longitude: this.props.user.location.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                }
            )
        }
    }

    handleOnRegionChangeComplete = (region: Region) => {
        this.setState({ region })
    }

    handleViewMe = () => this.setState({ previewMe: true })

    handleClosePrevieMe = () => this.setState({ previewMe: false })

    handleMarkerOnPress = (nearUser: NearByUsersProps) => {
        this.setState({ previewUser: nearUser, previewMe: false })
    }

    handlePreviewClose = () => this.setState({
        previewUser: null,
        sendInvite: false,
        previewMe: false
    })

    handleOnActionPress = () => {
        if (this.state.previewMe) {
            this.props.navigation.navigate('Me')
        } else if (this.state.previewUser) {
            this.handleNearUsersOnPress(this.state.previewUser)
        }
    }

    renderMapView = () => (
        <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete={this.handleOnRegionChangeComplete}
            showsUserLocation={true}
            followsUserLocation={true}
            onPress={(e) => console.log(e.nativeEvent)}
        >
            {
                <Marker
                    key={this.props.user.uid}
                    coordinate={{
                        latitude: this.props.user.location.coords.latitude,
                        longitude: this.props.user.location.coords.longitude,
                    }}
                >
                    <FontAwesome name="dot-circle-o" size={10} color={colors.primary} />
                </Marker>
            }
            {
                this.props.nearUsers && this.props.nearUsers.length > 0 && this.props.nearUsers.map((nearUser: NearByUsersProps) => {

                    if (nearUser.hideOnMap) return

                    return (
                        <Marker
                            key={nearUser.uid}
                            coordinate={{ latitude: nearUser.location.coords.latitude, longitude: nearUser.location.coords.longitude }}
                            style={{ width: 'auto', height: 'auto' }}
                            onPress={() => this.handleMarkerOnPress(nearUser)}
                        >
                            <ProfileImage friend={nearUser.friend} size='small' image={nearUser.profileImg} />
                        </Marker>
                    )
                })
            }
        </MapView >
    )

    render() {
        const { previewUser, sendInvite, previewMe, showRespond } = this.state;
        const { nearUsersFetched, user, navigation, update_invitation } = this.props;

        return (
            <View style={styles.container}>
                {nearUsersFetched && user.location ? this.renderMapView() : <ActivityIndicator />}

                <InvitationModal
                    visible={sendInvite}
                    handleClose={() => this.setState({ sendInvite: false })}
                    targetUser={previewUser}
                />

                <RespondModal
                    visible={showRespond}
                    handleClose={() => this.setState({ showRespond: false })}
                    targetUser={previewUser}
                />

                {previewMe ?
                    <UpdateStatus
                        user={user}
                        handleClose={this.handleClosePrevieMe}
                        update_status_message={this.props.update_status_message}
                    />
                    : previewUser &&
                    <View style={styles.preview_container}>
                        <Preview
                            nearUser={previewUser}
                            navigation={navigation}
                            onAction={this.handleOnActionPress}
                            onSendInvite={() => this.setState({ sendInvite: true })}
                            onRespond={() => this.setState({ showRespond: true })}
                            containerStyle={styles.preview_container}
                            onInvitationUpdate={update_invitation}
                            x={true}
                            handleX={this.handlePreviewClose}
                        />
                    </View>
                }
                <CustomButton text='View Me' type='primary' onPress={this.handleViewMe} moreStyles={styles.view_me} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        position: 'relative'
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    view_me: {
        position: 'absolute',
        bottom: 30,
        right: 10
    },
    refresh: {
        position: 'absolute',
        top: 30,
        left: 10
    },
    preview_container: {
        position: 'absolute',
        top: 60,
        zIndex: 100
    }
});

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched,
    allUsers: state.nearUsers.all
})

export default connect(mapStateToProps, { validate_near_users, update_invitation, refresh_near_users, update_status_message })(Maps);