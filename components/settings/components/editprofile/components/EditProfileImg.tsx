import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { BannerDispatchActionProps } from '../../../../../services/banner/tsTypes';
import { ProfileImgProps, NewProfileImgProps } from '../../../../../services/user/types';
import { hashCode } from '../../../../../utils/functions';
import { galleryImgSizeLimit } from '../../../../../utils/variables';
import { Icon } from '../../../../utils';
import { colors } from '../../../../utils/styles';
import ProfileImage from '../../../../profile/components/ProfileImage';

interface EditProfileImage {
    set_banner: BannerDispatchActionProps['set_banner'];
    profileImg: ProfileImgProps | null;
    imgObj?: NewProfileImgProps;
    setImgObj: (imgObj: NewProfileImgProps) => void;
    handleCameraRollPermission: () => Promise<boolean>
}

export default ({ set_banner, profileImg, imgObj, setImgObj, handleCameraRollPermission }: EditProfileImage) => {

    const pickImage = async () => {

        if (!await handleCameraRollPermission()) return;

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
            <ProfileImage image={imgObj ? imgObj : profileImg} size='large' />
            <Icon size={10} type="edit" color={colors.primary} pressColor={colors.secondary} onPress={pickImage} />
        </>
    )
}
