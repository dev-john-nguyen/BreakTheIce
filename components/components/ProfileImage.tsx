import React from 'react';
import { View, StyleSheet, StyleProp, Pressable } from 'react-native';
import { ProfileImgProps, NewProfileImgProps } from '../../services/user/types';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../utils/styles';
import { Image } from 'react-native';
import { Icon } from '../../utils/components';

interface ProfileImageProp {
    image: ProfileImgProps | NewProfileImgProps | null;
    friend?: Boolean;
    size: 'small' | 'regular' | 'large';
    onImagePress?: () => void;
}

export default ({ image, friend, size, onImagePress }: ProfileImageProp) => {

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
            iconSize = 12
    }


    const renderImage = () => {
        if (image && image.uri) {
            return <Image
                source={{ uri: image.cachedUrl ? image.cachedUrl : image.uri, cache: 'force-cache' }}
                style={styles.image}
            />
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

const baseStyles: StyleProp<any> = {
    friend: {
        position: 'absolute',
        transform: [
            {
                rotate: "90deg"
            }
        ]
    },
    image: {
        borderRadius: 100,
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
}

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
    image: {
        width: 120,
        height: 120,
        ...baseStyles.image
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
    image: {
        width: 25,
        height: 25,
        ...baseStyles.image
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
    image: {
        width: 40,
        height: 40,
        ...baseStyles.image
    }
})