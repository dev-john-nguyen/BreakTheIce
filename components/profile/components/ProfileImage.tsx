import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, Pressable } from 'react-native';
import { ProfileImgProps, NewProfileImgProps } from '../../../services/user/types';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../utils/styles';
import { Image } from 'react-native';
import { Icon } from '../../utils';

interface ProfileImageProp {
    image: ProfileImgProps | NewProfileImgProps | null;
    friend?: Boolean;
    size: 'small' | 'regular' | 'large';
    onImagePress?: () => void;
}

export default ({ image, friend, size, onImagePress }: ProfileImageProp) => {
    const [errImg, setErrImg] = useState<boolean>(false);

    var styles: any, iconSize: number;

    switch (size) {
        case 'small':
            styles = smallStyles;
            iconSize = 5;
            break;
        case 'large':
            styles = largeStyles;
            iconSize = 20
            break
        default:
            styles = regularStyles;
            iconSize = 10
    }


    const renderImage = () => {

        if (errImg) return (
            <FontAwesome
                name="user-circle-o"
                color={colors.primary}
                style={styles.icon}
            />
        )

        if (image && image.uri) {
            return (
                <View style={styles.image_container}>
                    <Image
                        source={{ uri: image.uri, cache: 'force-cache' }}
                        style={baseStyles.image}
                        onError={() => setErrImg(true)}
                    />
                </View>
            )
        }

        return <FontAwesome
            name="user-circle-o"
            color={colors.primary}
            style={styles.icon}
        />
    }

    return (
        <Pressable style={styles.container} onPress={onImagePress}>
            {renderImage()}
            {friend && <Icon type='link' size={iconSize} color={colors.primary} style={styles.friend} />}
        </Pressable>
    )
}

const baseStyles: StyleProp<any> = StyleSheet.create({
    friend: {
        position: 'absolute',
        transform: [
            {
                rotate: "90deg"
            }
        ]
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100
    },
    image_container: {
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})

const largeStyles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    friend: {
        ...baseStyles.friend
    },
    icon: {
        width: 100,
        height: 100,
        fontSize: 100
    },
    image_container: {
        width: 120,
        height: 120,
        ...baseStyles.image_container
    }
})

const smallStyles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    friend: {
        ...baseStyles.friend,
        right: -2,
    },
    icon: {
        width: 25,
        height: 25,
        fontSize: 25
    },
    image_container: {
        width: 30,
        height: 30,
        ...baseStyles.image_container
    }
})

const regularStyles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    friend: {
        ...baseStyles.friend,
        right: -5,
    },
    icon: {
        width: 40,
        height: 40,
        fontSize: 40
    },
    image_container: {
        width: 45,
        height: 45,
        ...baseStyles.image_container
    }
})