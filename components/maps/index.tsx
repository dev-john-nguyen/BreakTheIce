import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { ProfilePage } from '../../utils/variables';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { validate_near_users } from '../../services/near_users/actions';
import { NearUsersRootProps, NearByUsersProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps, UserDispatchActionsProps, UserProfilePreviewProps } from '../../services/user/types';
import { HomeToChatNavProp } from '../navigation/utils';
import { MapProfileImg, CustomButton } from '../../utils/components';
import { go_offline } from '../../services/user/actions';
import Preview from './components/Preview';
import InvitationModal from '../modal/InvitationModal';

interface RegionProps {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface MapStateProps {
    region: RegionProps;
    selectedNearUser: NearByUsersProps | null;
    previewUser: (NearByUsersProps & { me: boolean }) | null;
    sendInvite: boolean;
}

interface MapsProps {
    navigation: HomeToChatNavProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    allUsers: NearUsersRootProps['all'];
    user: UserRootStateProps;
    go_offline: UserDispatchActionsProps['go_offline'];
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//location and stateCity are checked are parent element so this won't render unless those are checked
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
            previewUser: null,
            sendInvite: false
        }
    }

    onRegionChange = (region: RegionProps) => {
        this.setState({ region })
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
        const { uid, username, bioShort, location, age, hideOnMap } = this.props.user;
        const mePreview: NearByUsersProps & { me: boolean } = {
            uid,
            username,
            bioShort,
            location,
            age,
            hideOnMap,
            friend: false,
            distance: 0,
            sentInvite: false,
            me: true
        }

        this.setState({
            previewUser: mePreview
        })
    }

    handleMarkerOnPress = (nearUser: NearByUsersProps) => {
        const previewUser = { ...nearUser, me: false }
        this.setState({ previewUser })
    }

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
                                <MapProfileImg friend={nearUser.friend} />
                            </Marker>
                        )
                    })
                }
            </MapView >
        )

        const { previewUser, sendInvite } = this.state;
        const { nearUsersFetched, user, go_offline, navigation } = this.props;

        return (
            <View style={styles.container}>
                {nearUsersFetched && user.location ? renderMapView : <ActivityIndicator />}

                <InvitationModal
                    visible={sendInvite}
                    handleClose={() => this.setState({ sendInvite: false })}
                    targetUser={previewUser}
                />

                {previewUser && <Preview
                    nearUser={previewUser}
                    navigation={navigation}
                    onClose={() => this.setState({ previewUser: null, sendInvite: false })}
                    onSendInvite={() => this.setState({ sendInvite: true })}
                />}

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
        flex: 1
    },
    my_location: {
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
    },
    view_me: {
        position: 'absolute',
        bottom: 10,
        right: 10
    }
});

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched,
    allUsers: state.nearUsers.all
})

export default connect(mapStateToProps, { validate_near_users, go_offline })(Maps);