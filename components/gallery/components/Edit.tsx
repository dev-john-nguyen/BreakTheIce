import React, { useState, useEffect, ReactNode, useLayoutEffect } from 'react';
import { View, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../utils/styles';
import { galleryImgSizeLimit } from '../../../utils/variables';
import { NewGalleryProps, UserRootStateProps } from '../../../services/user/tsTypes';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';
import { RootProps } from '../../../services';
import { save_gallery } from '../../../services/user/actions';
import { UserDispatchActionsProps } from '../../../services/user/tsTypes';
import { UtilsRootStateProps } from '../../../services/utils/tsTypes';
import { CustomButton, SaveSvg, PlusSvg } from '../../../utils/components';
import DraggableFlatList from "react-native-draggable-flatlist";
import { AutoId } from '../../../utils/functions';
import _ from 'lodash'
import { MeStackNavigationProp } from '../../navigation/utils';
//Summary
//image limit will be set to 10000000 byte = 10mb
interface UploadImageProps {
    save_gallery: UserDispatchActionsProps['save_gallery'];
    statusBar: UtilsRootStateProps['statusBar'];
    gallery: UserRootStateProps['gallery'];
    navigation: MeStackNavigationProp;
}

interface ImgObsProps {
    id: string;
    uri?: string;
    url?: string;
    blob?: Blob;
    description: string;
}

const UploadImage = ({ save_gallery, statusBar, gallery, navigation }: UploadImageProps) => {
    const [imgObjs, setImgObjs] = useState<ImgObsProps[]>([]);


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', right: 20 }}>
                    <Pressable onPress={pickImage}>
                        {({ pressed }) => <PlusSvg pressed={pressed} styles={{ marginRight: 10 }} />}
                    </Pressable >
                    <Pressable onPress={handleSaveGallery}>
                        {({ pressed }) => <SaveSvg pressed={pressed} />}
                    </Pressable >
                </View>

            )
        })
    })

    useEffect(() => {
        //copy gallery to component

        setImgObjs(_.cloneDeep(gallery));

        (async () => {
            try {
                const { status: CameraRollStatus } = await ImagePicker.requestCameraRollPermissionsAsync();

                if (CameraRollStatus === 'granted') {
                }
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: .5
        });

        if (!result.cancelled) {
            //get blob

            var imgBlob: Blob;
            try {
                var response = await fetch(result.uri)
                imgBlob = await response.blob();
            } catch (e) {
                return console.log(e)
            }

            if (imgBlob.size > galleryImgSizeLimit) {
                return console.log('Image too large. Image must be 10mb or smaller.');
            }

            imgObjs.push({
                uri: result.uri,
                blob: imgBlob,
                description: '',
                id: AutoId.newId()
            });

            setImgObjs([...imgObjs]);
        }
    };

    const handleSaveGallery = () => {
        // save_gallery(imgObjs)
        console.log(imgObjs)
    }

    const renderItem = ({ item, index, drag, isActive }: any): ReactNode => {
        return (
            <Pressable
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onLongPress={drag}
            >
                <View style={[styles.image_content, isActive && styles.image_content_drag]}>
                    <Image source={{ uri: item.uri ? item.uri : item.url }} style={styles.image} />
                    <TextInput
                        style={styles.image_description_input}
                        placeholder="Add a description... (100 character limit)"
                        multiline={true}
                        maxLength={100}
                        value={imgObjs[index] ? imgObjs[index].description : ''}
                        onChangeText={(text) => {
                            imgObjs[index].description = text
                            setImgObjs([...imgObjs])
                        }}
                    />
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <DraggableFlatList
                contentContainerStyle={styles.flat_list}
                data={imgObjs}
                renderItem={renderItem}
                keyExtractor={(item, index) => `draggable-item-${item.id ? item.id : index.toString()}`}
                onDragEnd={({ data }) => setImgObjs(data)}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    flat_list: {
        padding: 50,
        paddingTop: 30,
        paddingBottom: 10
    },
    add_image_container: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(40,223,153,.5)',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        marginTop: 20,
        elevation: 2,
        backgroundColor: colors.primary,
        height: 300,
        width: 300,
        padding: 50,
    },
    button_container: {
        position: 'absolute',
        top: 25,
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        zIndex: 10,
        width: '60%'
    },
    scroll_view: {
        alignItems: 'center'
    },
    image_content: {
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(40,223,153,.5)',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        backgroundColor: '#eee'
    },
    image_content_drag: {
        margin: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,
        elevation: 17,
        backgroundColor: colors.lightGrey
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    image_description_input: {
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 12,
        alignSelf: 'flex-start',
        fontWeight: "400",
        letterSpacing: .5
    }
})

const mapStateToProps = (state: RootProps) => ({
    statusBar: state.utils.statusBar,
    gallery: state.user.gallery
})

export default connect(mapStateToProps, { save_gallery })(UploadImage);