import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, KeyboardAvoidingView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NewGalleryItemProps } from '../../../services/user/types';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';
import * as ImageManipulator from 'expo-image-manipulator';
import { galleryImgSizeLimit } from '../../../utils/variables';
import { hashCode, AutoId } from '../../../utils/functions';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Icon, CustomInput, HeaderText, CustomButton, BodyText } from '../../utils';
import { colors, normalize, dropShadow, dropShadowDeep } from '../../utils/styles';
import { introStyles } from './utils';

//Summary
//image limit will be set to 10000000 byte = 10mb
//need to lower the size
interface UploadGalleryProps {
    set_banner: BannerDispatchActionProps['set_banner'];
    handleCameraRollPermission: () => Promise<boolean>;
    imgObjs: NewGalleryItemProps[]
    setImgObjs: (imgObjs: NewGalleryItemProps[]) => void;
}

export default ({ set_banner, handleCameraRollPermission, imgObjs, setImgObjs }: UploadGalleryProps) => {
    const [intro, setIntro] = useState(true)
    const fadeAmin = useRef(new Animated.Value(0)).current
    var mount = useRef<boolean>()

    useEffect(() => {
        mount.current = true
        Animated.timing(fadeAmin, {
            delay: 3000,
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            mount && setIntro(false)
        })

        return () => {
            mount.current = false
        }
    }, [])

    const pickImage = async () => {

        if (!await handleCameraRollPermission()) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1
        });


        if (!result.cancelled) {

            const manipResult = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 1000 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );

            //get blob
            var imgBlob: Blob;

            try {
                var response = await fetch(manipResult.uri)
                imgBlob = await response.blob();
            } catch (e) {
                console.log(e)
                return set_banner('Oops! Something went wrong fetching your image.', 'error')
            }

            if (imgBlob.size > galleryImgSizeLimit) {
                return set_banner('Image too large. Image must be 10mb or smaller.', 'warning');
            }

            //generate the image name
            //might be an issue if the user what's to adjust the photo in some way and resubmit it ** resolved .. realized manipulate will return a diff uri

            var name: string = hashCode(manipResult.uri)

            imgObjs.unshift({
                uri: manipResult.uri,
                blob: imgBlob,
                description: '',
                id: AutoId.newId(),
                name: name
            });

            setImgObjs([...imgObjs]);
        }
    };

    const handleRemoveGalleryItem = (id: string) => {
        //find item and set removed to true or splice out the image
        //if the image was a new
        var index = imgObjs.findIndex(item => item.id === id);

        if (index !== undefined) {
            const { removed, url } = imgObjs[index]
            imgObjs.splice(index, 1)

        } else {
            return set_banner('Issues removing the image', 'error')
        }

        setImgObjs([...imgObjs])
    }

    const renderItem = ({ item, index, drag, isActive }: RenderItemParams<NewGalleryItemProps>): ReactNode => (
        <Pressable
            style={{
                alignItems: "center",
                justifyContent: "center",
            }}
            onLongPress={drag}
        >
            <View style={[isActive ? styles.image_content_drag : styles.image_content, isActive ? dropShadowDeep : dropShadow]}>

                <Icon type={item.removed ? 'trash-2' : 'trash'} color={colors.red} pressColor={colors.lightRed} size={24} onPress={() => handleRemoveGalleryItem(item.id)} style={styles.trash} />

                <Image
                    source={{ uri: item.uri ? item.uri : item.cachedUrl ? item.cachedUrl : item.url, cache: 'force-cache' }} style={styles.image}
                />

                <CustomInput
                    style={styles.image_description_input}
                    placeholder="Add a description... (100 character limit)"
                    multiline={true}
                    maxLength={100}
                    value={index !== undefined && imgObjs[index] ? imgObjs[index].description : ''}
                    onChangeText={(text) => {
                        if (index !== undefined) {
                            imgObjs[index].description = text
                            setImgObjs([...imgObjs])
                        } else {
                            set_banner('Dragging has not completed.', 'warning')
                        }
                    }}
                />
            </View>
        </Pressable>
    );

    const previewGalleryImage = (
        <View style={[styles.image_content, dropShadow]}>
            <Image
                source={require('../sunset.jpg')}
                style={styles.image}
            />
            <BodyText
                style={[styles.image_description_input, {
                    padding: 12,
                    paddingTop: 12,
                }]}
            >I love morning sunsets with friends</BodyText>
        </View>
    )


    if (intro) return (
        <Animated.View style={[
            {
                opacity: fadeAmin.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [1, .2, 0]
                }),
                flex: 1
            }
        ]}>
            <View style={styles.container}>
                <HeaderText style={introStyles.intro_header}>Lastly, Lets Add Some Photos To Your Gallery!</HeaderText>
                <BodyText style={introStyles.intro_body}>Upload up to 5 images to the gallery.</BodyText>
            </View>
        </Animated.View>
    )


    return (
        <View style={styles.container}>
            {imgObjs.length < 5 ? <CustomButton
                type='primary'
                text="Upload A New Photo"
                onPress={pickImage}
                style={styles.button}
            />
                :
                <CustomButton
                    type='disabled'
                    text='5 Photo Limit Reached'
                    style={styles.button}
                />
            }
            <KeyboardAvoidingView keyboardVerticalOffset={120} behavior={'height'} style={{ flex: 1 }}>
                <DraggableFlatList
                    ListEmptyComponent={previewGalleryImage}
                    contentContainerStyle={styles.flat_list}
                    keyboardDismissMode='interactive'
                    data={imgObjs}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `draggable-item-${item.id ? item.id : index.toString()}`}
                    onDragEnd={({ data }) => setImgObjs(data)}
                />
            </KeyboardAvoidingView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    header: {
        fontSize: normalize(25),
        color: colors.primary,
        marginBottom: 10
    },
    sub_header: {
        fontSize: normalize(15),
        color: colors.secondary,
        marginBottom: 20,
        marginLeft: 20
    },
    flat_list: {
        marginRight: 40,
        marginLeft: 40,
        paddingBottom: 10,
    },
    trash: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 10
    },
    add_image_container: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: `rgba(${colors.primary_rgb},.5)`,
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
        borderColor: `rgba(${colors.primary_rgb},.5)`,
        borderRadius: 5,
        backgroundColor: colors.white
    },
    image_content_drag: {
        marginRight: 40,
        marginLeft: 40,
        marginTop: 5,
        borderWidth: 1,
        borderColor: `rgba(${colors.primary_rgb},.5)`,
        borderRadius: 5,
        backgroundColor: colors.white
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    image_description_input: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 12,
        alignSelf: 'flex-start',
        color: colors.black
    },
    button: {
        marginBottom: 20,
        marginRight: 40,
        marginLeft: 40,
        alignSelf: 'center'
    }
})