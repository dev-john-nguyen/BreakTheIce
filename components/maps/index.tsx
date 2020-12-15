import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { ProfilePage, NearByListPage } from '../../utils/variables';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { validate_near_users } from '../../services/near_users/actions';
import { NearUsersRootProps, NearUsersDispatchActionProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/tsTypes';
import { HomeStackNavigationProp } from '../navigation/utils';
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
    selectedNearUser: UserRootStateProps | null;
}

interface MapsProps {
    navigation: HomeStackNavigationProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
    allUsers: NearUsersRootProps['all'];
    user: UserRootStateProps;
    validate_near_users: NearUsersDispatchActionProps['validate_near_users'];
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

    handleNearUsersOnPress = (nearUsers: UserRootStateProps) => {
        this.props.navigation.push(ProfilePage, {
            profileUid: nearUsers.uid
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
                style={styles.mapStyle}
                region={this.state.region}
                showsUserLocation={true}
                onPress={(e) => console.log(e.nativeEvent)}
            >
                {
                    this.props.nearUsers && this.props.nearUsers.length > 0 && this.props.nearUsers.map((nearUser: UserRootStateProps) => (
                        <Marker
                            key={nearUser.uid}
                            coordinate={{ latitude: nearUser.location.coords.latitude, longitude: nearUser.location.coords.longitude }}
                            style={{ width: 'auto', height: 'auto' }}
                            onPress={(e) => this.handleNearUsersOnPress(nearUser)}
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
                <Pressable onPress={this.handleOnMyLocationPress} >
                    <Text>My Location</Text>
                </Pressable>
                <Pressable onPress={this.handleOnListViewPress}>
                    <Text>List View</Text>
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    ModalContainer: {
        margin: 20,
        backgroundColor: 'green',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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