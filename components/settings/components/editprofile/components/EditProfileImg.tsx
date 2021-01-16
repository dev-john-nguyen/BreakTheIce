import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { UtilsDispatchActionProps } from '../../../../../services/utils/tsTypes';
import { ProfileImgProps, NewProfileImgProps } from '../../../../../services/user/types';
import { hashCode } from '../../../../../utils/functions';
import { galleryImgSizeLimit } from '../../../../../utils/variables';
import { ProfileImg, Icon } from '../../../../../utils/components';
import { colors } from '../../../../../utils/styles';
import ProfileImage from '../../../../profile/components/ProfileImage';

interface EditProfileImage {
    set_banner: UtilsDispatchActionProps['set_banner'];
    profileImg: ProfileImgProps | undefined;
    imgObj?: NewProfileImgProps;
    setImgObj: (imgObj: NewProfileImgProps) => void;
}

export default ({ set_banner, profileImg, imgObj, setImgObj }: EditProfileImage) => {

    useEffect(() => {
        (async () => {
            try {
                const { status: CameraRollStatus } = await ImagePicker.requestCameraRollPermissionsAsync();

                if (CameraRollStatus !== 'granted') {
                    set_banner('Camera roll access denied. Will need access to edit gallery.', 'warning')
                }
            } catch (e) {
                set_banner('Oops! Something went wrong accessing your camera roll.', 'error')
            }
        })()

    }, [profileImg])


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {

            const manipResult = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 200 } }],
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

            setImgObj({
                uri: manipResult.uri,
                blob: imgBlob,
                name: name
            });
        }
    };

    return (
        <>
            <ProfileImage image={imgObj ? imgObj : profileImg} size='regular' />
            <Icon size={10} type="edit" color={colors.primary} pressColor={colors.secondary} onPress={pickImage} />
        </>
    )
}

const styles = StyleSheet.create({
    profile_image: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderColor: colors.primary,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41
    }
})

