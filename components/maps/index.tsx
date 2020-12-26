import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { ProfilePage, NearByListPage } from '../../utils/variables';
import { buttonsStyles, colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { validate_near_users } from '../../services/near_users/actions';
import { NearUsersRootProps, NearUsersDispatchActionProps, NearByUsersProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps } from '../../services/user/tsTypes';
import { HomeStackNavigationProp } from '../navigation/utils';
import { MapProfileImg } from '../../utils/components';

interface RegionProps {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface MapStateProps {
    region: RegionProps;
    selectedNearUser: NearByUsersProps | null;
}

interface MapsProps {
    navigation: HomeStackNavigationProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    allUsers: NearUsersRootProps['all'];
    user: UserRootStateProps;
}

//location and stateCity are checked are parent element so this won't render unless those are checked
class Maps extends React.Component<MapsProps, MapStateProps> {
    // _isMounted: boolean;
    // _initLocation: boolean;

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
        // this._isMounted = false;
        // this._initLocation = false;
        this.state = {
            region: initRegion,
            selectedNearUser: null
        }
    }

    // static propTypes: {
    //     nearUsers: Requireable<NearUsersRootProps['nearBy']>,
    //     allUsers: Requireable<NearUsersRootProps['all']>,
    //     nearUsersFetched: Requireable<NearUsersRootProps['fetched']>,
    //     user: Requireable<UserRootStateProps>,
    //     update_user_location: Requireable<UserDispatchActionsProps['update_user_location']>,
    //     validate_near_users: Requireable<NearUsersDispatchActionProps['validate_near_users']>
    // }

    componentDidMount() {
        //start watching position
        // this._isMounted = true
        // this.handleWatchPosition();
    }

    onRegionChange = (region: RegionProps) => {
        this.setState({ region })
    }

    handleNearUsersOnPress = (nearUsers: NearByUsersProps) => {
        this.props.navigation.push(ProfilePage, {
            profileUid: nearUsers.uid,
            title: nearUsers.username
        })
    }

    handleOnListViewPress = () => {
        this.props.navigation.push(NearByListPage)
    }

    handleOnMyLocationPress = () => {
        if (this.props.user.location) {
            this.setState(
                {
                    region: {
                        ...this.state.region,
                        latitude: this.props.user.location.coords.latitude,
                        longitude: this.props.user.location.coords.longitude
                    }
                }
            )
        }
    }

    render() {
        const renderMapView = (
            <MapView
                style={styles.map}
                region={this.state.region}
                showsUserLocation={true}
                onPress={(e) => console.log(e.nativeEvent)}
            >
                {
                    this.props.nearUsers && this.props.nearUsers.length > 0 && this.props.nearUsers.map((nearUser: NearByUsersProps) => (
                        <Marker
                            key={nearUser.uid}
                            coordinate={{ latitude: nearUser.location.coords.latitude, longitude: nearUser.location.coords.longitude }}
                            style={{ width: 'auto', height: 'auto' }}
                            onPress={(e) => this.handleNearUsersOnPress(nearUser)}
                        >
                            <MapProfileImg friend={nearUser.friend} />
                        </Marker>
                    ))
                }
            </MapView >
        )

        return (
            <View style={styles.container}>
                {this.props.nearUsersFetched && this.props.user.location ? renderMapView : <ActivityIndicator />}
                <View style={styles.myLocation}>
                    <Pressable onPress={this.handleOnMyLocationPress}
                        style={({ pressed }) => pressed ? buttonsStyles.button_secondary_pressed : buttonsStyles.button_secondary}>
                        {({ pressed }) => (
                            <Text
                                style={pressed ? buttonsStyles.button_secondary_text_pressed : buttonsStyles.button_secondary_text}
                            >My Location</Text>
                        )}
                    </Pressable>
                </View>
                <Pressable onPress={this.handleOnListViewPress}
                    style={({ pressed }) => pressed ? { ...styles.listView, ...buttonsStyles.button_primary_pressed } : { ...styles.listView, ...buttonsStyles.button_primary }}>
                    <Text style={buttonsStyles.button_primary_text}>List View</Text>
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
        position: 'relative'
    },
    map: {
        width: Dimensions.get('window').width,
        flex: 1
    },
    myLocation: {
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
    },
    listView: {
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

export default connect(mapStateToProps, { validate_near_users })(Maps);