import React from 'react'
import { View, StyleSheet, Image } from 'react-native';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';
import { HeaderText, BodyText, CustomButton } from '../../utils';
import { normalize, colors, dropShadowLight } from '../../utils/styles';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { NewProfileImgProps } from '../../../services/user/types';
import { galleryImgSizeLimit, windowWidth, windowHeight } from '../../../utils/variables';
import { hashCode } from '../../../utils/functions';

interface ProfileImageProps {
    set_banner: BannerDispatchActionProps['set_banner'];
    handleCameraRollPermission: () => Promise<boolean>;
    profileImg: NewProfileImgProps | undefined;
    setProfileImg: (profileImg: NewProfileImgProps | undefined) => void;
}

export default ({ set_banner, handleCameraRollPermission, profileImg, setProfileImg }: ProfileImageProps) => {

    const handleOnAllowAccess = async () => {

        if (!await handleCameraRollPermission()) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1
        });

        if (!result.cancelled) {

            const manipResult = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 500 } }],
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

            setProfileImg({
                uri: manipResult.uri,
                blob: imgBlob,
                name: name
            });
        }
    }

    return (
        <View style={styles.container}>
            <HeaderText style={styles.header}>Next, Profile Image!</HeaderText>
            <BodyText style={styles.sub_header}>Or you can simply skip and do this later.</BodyText>

            <View style={[styles.no_image, dropShadowLight]}>
                <Image
                    style={styles.image}
                    source={profileImg ? { uri: profileImg.uri } : require('../profile-image.jpg')}
                    onError={(err) => {
                        console.log(err)
                        setProfileImg(undefined)
                    }}
                />
            </View>
            <CustomButton
                type='primary'
                onPress={handleOnAllowAccess}
                text='Upload Profile Image'
                style={styles.button}
            />
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
        marginTop: (windowHeight / 20),
        marginBottom: 10
    },
    sub_header: {
        fontSize: normalize(15),
        color: colors.secondary,
        marginBottom: 20,
        marginLeft: 20
    },
    no_image: {
        borderRadius: 100,
        width: windowWidth / 3,
        height: windowWidth / 3,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 20
    },
    image: {
        width: windowWidth / 3,
        height: windowWidth / 3,
        borderRadius: 100
    },
    button: {
        marginTop: windowHeight / 20,
        alignSelf: 'center'
    }
})