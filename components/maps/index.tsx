import React from 'react';
import MapView, { Marker, EventUserLocation } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { getDistance } from 'geolib';
import { locationDistanceIntervalToUpdate, locationSpeedToUpdate } from '../../utils/variables';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { update_user_location } from '../../services/user/actions';
import { validate_near_users } from '../../services/near_users/actions';
import { NearUsersLocationProps, NearUsersProps, NearUsersDispatchActionProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/tsTypes';
import { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { userDefaultSvg } from '../../utils/svgs'
import { SvgXml } from 'react-native-svg';

interface RegionProps {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface MapStateProps {
    region: RegionProps;
    userLocation: LocationObject;
}

interface MapsProps {
    nearUsers: NearUsersProps['nearBy'];
    nearUsersFetched: NearUsersProps['fetched'];
    allUsers: NearUsersProps['all'];
    user: UserRootStateProps;
    update_user_location: UserDispatchActionsProps['update_user_location'];
    validate_near_users: NearUsersDispatchActionProps['validate_near_users'];
}

//location and stateCity are checked are parent element so this won't render unless those are checked
class Maps extends React.Component<MapsProps, MapStateProps> {
    _isMounted: boolean;
    _initLocation: boolean;

    constructor(props: MapsProps) {
        super(props);

        const { width, height } = Dimensions.get('window');
        const ASPECT_RATIO = width / height;
        const LATITUDE_DELTA = 0.005;
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

        const initRegion = {
            latitude: props.user.location.coords.latitude,
            longitude: props.user.location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }

        //handle clean up async actions
        this._isMounted = false;
        this._initLocation = false;
        this.state = {
            region: initRegion,
            userLocation: { ...props.user.location }
        }
    }

    // static propTypes: {
    //     nearUsers: Requireable<NearUsersProps['nearBy']>,
    //     allUsers: Requireable<NearUsersProps['all']>,
    //     nearUsersFetched: Requireable<NearUsersProps['fetched']>,
    //     user: Requireable<UserRootStateProps>,
    //     update_user_location: Requireable<UserDispatchActionsProps['update_user_location']>,
    //     validate_near_users: Requireable<NearUsersDispatchActionProps['validate_near_users']>
    // }

    componentWillUnmount() {

    }

    componentDidMount() {
        //start watching position
        this._isMounted = true
        this.handleWatchPosition();
    }

    onRegionChange = (region: RegionProps) => {
        this.setState({ region })
    }

    handleOnUserLocationChange = (e: EventUserLocation) => {
        var currentCoords = e.nativeEvent.coordinate
        const { location } = this.props.user

        if (!currentCoords) return console.log('failed to capture cur location')

        //compare distance travel since last known distance
        var distanceTraveled: number | undefined = getDistance(
            { latitude: currentCoords.latitude, longitude: currentCoords.longitude },
            { latitude: location.coords.latitude, longitude: location.coords.longitude }
        )

        console.log(distanceTraveled)

        if (!distanceTraveled) return console.log('empty' + distanceTraveled)

        //less than 10 meters than don't update
        if (distanceTraveled < 50) return console.log("Didn't travel far enough to save...");
        //check speed of the user

        if (currentCoords.speed! < 0 && currentCoords.speed > 2) return console.log(currentCoords.speed + " travling too fast to save");
        //then save to server

        console.log('saving....', currentCoords.speed, 'distance ' + distanceTraveled)
        //how to determine if the user is in a different city code now?

        var newLocation: LocationObject = {
            coords: {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                altitude: null,
                accuracy: currentCoords.accuracy,
                altitudeAccuracy: null,
                heading: currentCoords.heading,
                speed: currentCoords.speed
            },
            timestamp: + new Date()
        }

        this.props.set_user_location(this.props.user.uid, this.props.user.stateCity, newLocation)
    }

    handleWatchPosition = () => {
        Location.watchPositionAsync({ distanceInterval: locationDistanceIntervalToUpdate }, (newLocation) => {
            //to allow user to go back to location region
            this.setState({ userLocation: newLocation })

            const { user, nearUsers, allUsers } = this.props

            if (newLocation.coords) {

                if (!this._initLocation) {
                    this._initLocation = true;
                } else {
                    //check to see how fast the user is traveling to prevent too many calls
                    if ((newLocation.coords.speed && newLocation.coords.speed < locationSpeedToUpdate) || !newLocation.coords.speed) {
                        //update user location in the server
                        this._isMounted && this.props.update_user_location(user.uid, user.stateCity, newLocation);

                        if (allUsers.length > 0) {
                            //validate all the users within the city and see if they are within range
                            this._isMounted && this.props.validate_near_users(newLocation, nearUsers, allUsers);
                        }
                    }
                }

            }
        })
    }

    render() {
        const renderMapView = (
            <MapView
                style={styles.mapStyle}
                region={this.state.region}
                showsUserLocation={true}
                onPress={(e) => console.log(e.nativeEvent)}
            >
                {
                    this.props.nearUsers && this.props.nearUsers.length > 0 && this.props.nearUsers.map((newUser: NearUsersLocationProps) => (
                        <Marker
                            key={newUser.uid}
                            coordinate={{ latitude: newUser.latitude, longitude: newUser.longitude }}
                            style={{ width: 'auto', height: 'auto' }}
                            onPress={(e) => console.log(e.nativeEvent)}
                        >
                            <SvgXml xml={userDefaultSvg} width='20' height='20' fill={'#00FFFF'} />
                        </Marker>
                    ))
                }
            </MapView >
        )
        return (
            <View style={styles.container}>
                {this.props.nearUsersFetched && this.props.user.location ? renderMapView : <ActivityIndicator />}
                <Pressable onPress={() => this.state.userLocation && this.setState({ region: { ...this.state.region, latitude: this.state.userLocation.coords.latitude, longitude: this.state.userLocation.coords.longitude } })} >
                    <Text>My Location</Text>
                </Pressable>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: '80%',
    },
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

export default connect(mapStateToProps, { update_user_location, validate_near_users })(Maps);