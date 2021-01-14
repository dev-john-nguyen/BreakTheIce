import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { ProfilePage, NearByListPage } from '../../utils/variables';
import { buttonsStyles, colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { validate_near_users } from '../../services/near_users/actions';
import { NearUsersRootProps, NearUsersDispatchActionProps, NearByUsersProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { HomeStackNavigationProp, HomeToChatNavProp } from '../navigation/utils';
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
    previewNearUser: NearByUsersProps | null;
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
    _initRegion: {
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number
    }

    constructor(props: MapsProps) {
        super(props);

        this._initRegion = {
            latitude: props.user.location.coords.latitude,
            longitude: props.user.location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }

        //handle clean up async actions
        // this._isMounted = false;
        // this._initLocation = false;
        this.state = {
            region: this._initRegion,
            selectedNearUser: null,
            previewNearUser: null,
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

    handleOnListViewPress = () => {
        this.props.navigation.navigate(NearByListPage)
    }

    handleOnMyLocationPress = () => {
        if (this.props.user.location) {
            this.setState(
                {
                    region: this._initRegion

                }
            )
        }
    }

    handleOnRegionChangeComplete = (region: Region) => {
        this.setState({ region })
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
                                onPress={(e) => this.setState({ previewNearUser: nearUser })}
                            >
                                <MapProfileImg friend={nearUser.friend} />
                            </Marker>
                        )
                    })
                }
            </MapView >
        )

        const { previewNearUser, sendInvite } = this.state;
        const { nearUsersFetched, user, go_offline, navigation } = this.props;

        return (
            <View style={styles.container}>
                {nearUsersFetched && user.location ? renderMapView : <ActivityIndicator />}

                <InvitationModal
                    visible={sendInvite}
                    handleClose={() => this.setState({ sendInvite: false })}
                    targetUser={previewNearUser}
                />

                {previewNearUser && <Preview
                    nearUser={previewNearUser}
                    navigation={navigation}
                    onClose={() => this.setState({ previewNearUser: null, sendInvite: false })}
                    onSendInvite={() => this.setState({ sendInvite: true })}
                />}

                <CustomButton text="My Location" type='secondary' onPress={this.handleOnMyLocationPress} moreStyles={styles.my_location} />

                <CustomButton text="List View" type='primary' onPress={this.handleOnListViewPress} moreStyles={styles.list_view} />

                <CustomButton text="Go Offline" type='red_outline' onPress={go_offline} moreStyles={styles.go_offline} />
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
    list_view: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    go_offline: {
        position: 'absolute',
        bottom: 10,
        left: 10
    }
});

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched,
    allUsers: state.nearUsers.all
})


// Maps.propTypes = {
//     nearUsers: PropTypes.array,
//     nearUsersFetched: PropTypes.bool,
//     allUsers: PropTypes.array,
//     // couldn't find a solution for LocationObject keys that allow undefine
//     //@ts-ignore
//     user: PropTypes.shape({
//         uid: PropTypes.string.isRequired,
//         location: PropTypes.shape({
//             coords: PropTypes.shape({
//                 latitude: PropTypes.number.isRequired,
//                 longitude: PropTypes.number.isRequired,
//                 altitude: PropTypes.number,
//                 accuracy: PropTypes.number,
//                 altitudeAccuracy: PropTypes.number,
//                 heading: PropTypes.number,
//                 speed: PropTypes.number
//             }).isRequired,
//             timestamp: PropTypes.number
//         }).isRequired,
//         stateCity: PropTypes.object.isRequired
//     }),
//     update_user_location: PropTypes.func,
//     validate_near_users: PropTypes.func
// }

export default connect(mapStateToProps, { validate_near_users, go_offline })(Maps);