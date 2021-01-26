import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { StyleSheet, View, Dimensions, ActivityIndicator, Image } from 'react-native';
import { ProfilePage } from '../../utils/variables';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { validate_near_users } from '../../services/near_users/actions';
import { NearUsersRootProps, NearByUsersProps } from '../../services/near_users/types';
import { UserRootStateProps } from '../../services/user/types';
import { HomeToChatNavProp } from '../navigation/utils/types';
import { CustomButton } from '../../utils/components';
import Preview from '../../utils/components/Preview';
import InvitationModal from '../modal/InvitationModal';
import ProfileImage from '../../utils/components/ProfileImage';
import { colors } from '../../utils/styles';
import { InvitationsDispatchActionProps } from '../../services/invitations/types';
import { update_invitation } from '../../services/invitations/actions';

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
}

interface MapsProps {
    navigation: HomeToChatNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    allUsers: NearUsersRootProps['all'];
    user: UserRootStateProps;
    update_invitation: InvitationsDispatchActionProps['update_invitation']
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.003;
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
            sendInvite: false
        }
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

    handleViewMe = () => {
        const { uid, username, bioShort, location, age, hideOnMap, profileImg } = this.props.user;

        const mePreview: NearByUsersProps = {
            uid,
            profileImg,
            username,
            bioShort,
            location,
            age,
            hideOnMap,
            friend: false,
            distance: 0,
            sentInvite: false,
            receivedInvite: false
        }

        this.setState({
            previewUser: mePreview,
            previewMe: true
        })
    }

    handleMarkerOnPress = (nearUser: NearByUsersProps) => {
        this.setState({ previewUser: nearUser })
    }

    handleOnActionPress = () => this.setState({
        previewUser: null,
        sendInvite: false,
        previewMe: false
    })

    render() {

        const renderMapView = (
            <MapView
                style={styles.map}
                region={this.state.region}
                onRegionChangeComplete={this.handleOnRegionChangeComplete}
                showsUserLocation={true}
                onPress={(e) => console.log(e.nativeEvent)}
            >
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

        const { previewUser, sendInvite, previewMe } = this.state;
        const { nearUsersFetched, user, navigation, update_invitation } = this.props;

        return (
            <View style={styles.container}>
                {nearUsersFetched && user.location ? renderMapView : <ActivityIndicator />}

                <InvitationModal
                    visible={sendInvite}
                    handleClose={() => this.setState({ sendInvite: false })}
                    targetUser={previewUser}
                />

                {previewUser &&
                    <View style={styles.preview_container}>
                        <Preview
                            nearUser={previewUser}
                            me={previewMe}
                            navigation={navigation}
                            onAction={this.handleOnActionPress}
                            onSendInvite={() => this.setState({ sendInvite: true })}
                            containerStyle={styles.preview_container}
                            containerPressStyle={{ ...styles.preview_container, backgroundColor: colors.tertiary }}
                            onInvitationUpdate={update_invitation}
                        />
                    </View>
                }

                <CustomButton text="My Location" type='secondary' onPress={this.handleOnMyLocationPress} moreStyles={styles.my_location} />
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
    my_location: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
    },
    view_me: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    preview_container: {
        position: 'absolute',
        top: 40,
        backgroundColor: colors.secondary,
        zIndex: 100
    }
});

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched,
    allUsers: state.nearUsers.all
})

export default connect(mapStateToProps, { validate_near_users, update_invitation })(Maps);