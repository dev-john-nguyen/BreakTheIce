import React, { useState, useEffect, JSXElementConstructor, ReactElement } from 'react';
import _ from 'lodash';
import { View, Dimensions, Pressable, Text, StyleSheet } from 'react-native';
import MapView, { Marker, MapEvent } from 'react-native-maps';
import { PlaceProp } from '../../services/profile/tsTypes';
import { buttonsStyles, colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { update_timeline_places_visited } from '../../services/user/actions';
import { UserDispatchActionsProps, UserRootStateProps } from '../../services/user/tsTypes';
import { EditSvg, SaveSvg, MapProfileImg } from '../../utils/components';
import { TextInput } from 'react-native-gesture-handler';
import { RootProps } from '../../services';
import { set_error } from '../../services/utils/actions';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import { AutoId } from '../../utils/functions';
import PlacesVisitedForm from './components/PlacesVisitedForm';
import { CustomButton } from '../../utils/components';

//set on first location and then go from there

interface PlacesVisitedProps {
    navigation: any;
    route: any;
    update_timeline_places_visited: UserDispatchActionsProps['update_timeline_places_visited'];
    user: UserRootStateProps;
    set_error: UtilsDispatchActionProps['set_error']
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const initNewPlaceVisited: PlaceProp = {
    id: '',
    coordinate: {
        latitude: 0,
        longitude: 0
    },
    name: '',
    comment: ''
}

const EditPlacesVisited = (props: PlacesVisitedProps) => {
    const { placesVisited, uid, locationDocId } = props.route.params;

    const [curPlace, setCurPlace] = useState<number>(0);
    const [edit, setEdit] = useState<boolean>(false);
    const [clonedPlacesVisited, setClonedPlacesVisited] = useState<PlaceProp[]>(_.cloneDeep(placesVisited))
    const [newPlaceVisited, setNewPlaceVisited] = useState<PlaceProp>(initNewPlaceVisited);

    React.useLayoutEffect(() => {
        uid === props.user.uid && props.navigation.setOptions({
            headerRight: () => (

                edit ? <Pressable onPress={handleSaveUpdates}>
                    {({ pressed }) => <SaveSvg pressed={pressed} styles={{ right: 10 }} />}
                </Pressable > : <Pressable onPress={() => setEdit(true)}>
                        {({ pressed }) => <EditSvg pressed={pressed} styles={{ right: 10 }} />}
                    </Pressable>

            )
        })
    })

    const handleNext = () => {
        if (curPlace < clonedPlacesVisited.length - 1) {
            setCurPlace(curPlace + 1);
        } else {
            setCurPlace(0)
        }
    }

    const handleSaveUpdates = () => {
        //don't allow updates to save
        if (!_.isEqual(clonedPlacesVisited, placesVisited)) {
            props.update_timeline_places_visited(uid, locationDocId, clonedPlacesVisited)
                .then((resPlacesVisited) => {
                    if (resPlacesVisited) {
                        setClonedPlacesVisited([...resPlacesVisited])
                    }
                })
        }

        //set edit to false and set curplace to 0
        setEdit(false);
        setCurPlace(0);
    }

    const handleSaveNewPlaceVisited = () => {
        var key: keyof typeof newPlaceVisited;

        //check for empty values
        for (key in newPlaceVisited) {
            if (!newPlaceVisited[key]) {
                //empty value found so don't allow save
                return props.set_error('Found empty values', 'warning')
            }

            //check coordinates
            if (key === 'coordinate') {
                if (newPlaceVisited[key].latitude == 0 || newPlaceVisited[key].longitude == 0) {
                    return props.set_error('Please select coordinates on the map to indicate the location of the new place.', 'warning')
                }
            }
        }

        setClonedPlacesVisited([...clonedPlacesVisited, newPlaceVisited])
        setNewPlaceVisited(initNewPlaceVisited)
    }

    const handleOnRemovePress = () => {
        //curplace is the current index
        if (clonedPlacesVisited[curPlace].removed) {
            clonedPlacesVisited[curPlace].removed = false;
        } else {
            clonedPlacesVisited[curPlace].removed = true;
        }

        setClonedPlacesVisited([...clonedPlacesVisited])
    }

    const handleRegion = () => {
        //readjust the region to user location if there's no placesVisited available
        //if newPlaceVisited id is true and has coordinates readjust the region

        if (newPlaceVisited.coordinate.latitude && newPlaceVisited.coordinate.longitude) {
            return {
                latitude: newPlaceVisited.coordinate.latitude,
                longitude: newPlaceVisited.coordinate.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        }

        if (clonedPlacesVisited.length < 1) {
            return {
                latitude: props.user.location.coords.latitude,
                longitude: props.user.location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        }

        return {
            latitude: clonedPlacesVisited[curPlace].coordinate.latitude,
            longitude: clonedPlacesVisited[curPlace].coordinate.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
    }

    const handleOnMapPress = (e: MapEvent<{}>) => {
        //update coordinates for newPlaceVisited
        if (newPlaceVisited.id) {
            if (e.nativeEvent.coordinate) {
                setNewPlaceVisited({
                    ...newPlaceVisited,
                    coordinate: e.nativeEvent.coordinate
                })
            }
        }
    }

    const handleCreateNewPlaceButton = () => {
        //Create new id to init newPlaceVisited
        setNewPlaceVisited({
            ...newPlaceVisited,
            id: AutoId.newId()
        })
    }

    const renderHeaderBanner = () => {

        if (edit) {
            if (clonedPlacesVisited.length > 0) {
                return (
                    <>
                        <TextInput placeholder='name'
                            value={clonedPlacesVisited[curPlace].name}
                            onChangeText={text => {
                                clonedPlacesVisited[curPlace].name = text
                                setClonedPlacesVisited([...clonedPlacesVisited])
                            }}
                            style={[styles.text_input, { fontSize: 14 }]}
                        />
                        <TextInput
                            multiline={true}
                            numberOfLines={2}
                            maxLength={100}
                            placeholder='comment'
                            value={clonedPlacesVisited[curPlace].comment}
                            onChangeText={text => {
                                clonedPlacesVisited[curPlace].comment = text
                                setClonedPlacesVisited([...clonedPlacesVisited])
                            }}
                            style={[styles.text_input, { fontSize: 12 }]}
                        />
                    </>
                )
            }
        } else if (clonedPlacesVisited.length > 0) {
            return (
                <View>
                    <Text style={styles.content_text_name}>{clonedPlacesVisited[curPlace].name}</Text>
                    <Text style={styles.content_text_comment}>{clonedPlacesVisited[curPlace].comment}</Text>
                </View>
            )
        }


        return (
            <View>
                <Text style={styles.content_text_name}>No Places Saved</Text>
            </View>
        )

    }

    return (
        <View style={styles.container}>
            <View style={styles.content_container}>
                {newPlaceVisited.id
                    ?
                    <PlacesVisitedForm
                        handleSaveNewPlaceVisited={handleSaveNewPlaceVisited}
                        handleClose={() => setNewPlaceVisited(initNewPlaceVisited)}
                        newPlaceVisited={newPlaceVisited}
                        setNewPlaceVisited={(newPlace: PlaceProp) => setNewPlaceVisited({ ...newPlace })}
                        styles={styles} />
                    :
                    renderHeaderBanner()}

                {
                    edit && !newPlaceVisited.id &&
                    <View style={styles.button_section}>
                        {
                            clonedPlacesVisited.length > 0
                            && <CustomButton type='red_outline' text={clonedPlacesVisited[curPlace].removed ? "Undo" : "Remove"} onPress={handleOnRemovePress} />
                        }
                        <CustomButton type="primary" text="New" onPress={handleCreateNewPlaceButton} />
                    </View>
                }
            </View>
            <MapView
                style={{ flex: 1 }}
                onPress={handleOnMapPress}
                region={handleRegion()}
            >
                {
                    clonedPlacesVisited.length > 0 && clonedPlacesVisited.map((place: PlaceProp) => (
                        <Marker
                            key={place.id}
                            coordinate={place.coordinate}
                            onPress={(e) => console.log(place)}
                        >

                        </Marker>
                    ))
                }
                {
                    props.user.location.coords &&
                    <Marker
                        key={props.user.uid}
                        coordinate={{
                            latitude: props.user.location.coords.latitude,
                            longitude: props.user.location.coords.longitude
                        }}
                    >
                        <MapProfileImg friend={false} />
                    </Marker>
                }
                {
                    newPlaceVisited.coordinate &&
                    <Marker
                        key={newPlaceVisited.id}
                        coordinate={newPlaceVisited.coordinate}
                    />
                }
            </MapView >
            <CustomButton type="primary" text="Next" onPress={handleNext} moreStyles={styles.next_button} />
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    content_container: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        zIndex: 10,
        padding: 20,
        width: '100%'
    },
    content_text_name: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1
    },
    content_text_comment: {
        color: colors.white,
        fontSize: 12,
        marginTop: 5,
        fontWeight: '500'
    },
    next_button: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    save_button: {
        position: 'absolute',
        bottom: 10,
        left: 10
    },
    text_input: {
        marginBottom: 15,
        textAlign: 'center',
        width: '100%',
        padding: 10,
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 10,
        color: colors.white,
        fontWeight: '500'
    },
    button_section: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 10
    },
    new_place_header_text: {
        fontSize: 16,
        borderColor: colors.white,
        color: colors.white,
        marginBottom: 20,
        letterSpacing: 1,
        fontWeight: '700',
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})


export default connect(mapStateToProps, { update_timeline_places_visited, set_error })(EditPlacesVisited);