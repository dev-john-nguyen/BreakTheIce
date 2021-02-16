import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, Pressable } from 'react-native';
import { ProfileImgProps, NewProfileImgProps } from '../../../services/user/types';
import { FontAwesome } from '@expo/vector-icons';
import { colors, dropShadowListContainer, dropShadowLight } from '../../utils/styles';
import { Image } from 'react-native';
import { Icon } from '../../utils';
import { windowWidth } from '../../../utils/variables';

interface ProfileImageProp {
    image: ProfileImgProps | NewProfileImgProps | null;
    friend: Boolean;
    size: 'small' | 'regular';
    onImagePress?: () => void;
}

export const CircleProfileImage = ({ image, friend, size, onImagePress }: ProfileImageProp) => {
    const [errImg, setErrImg] = useState<boolean>(false);

    var styles: any, iconSize: number;

    switch (size) {
        case 'small':
            styles = smallStyles;
            iconSize = 5;
            break;
        default:
            styles = regularStyles;
            iconSize = 15
    }


    const renderImage = () => {
        if (image && image.uri && !errImg) {
            const uri = image.cachedUrl ? image.cachedUrl : image.uri

            return (
                <View style={styles.image_container}>
                    <Image
                        source={{ uri, cache: 'force-cache' }}
                        style={[baseStyles.image, {
                            borderRadius: 50
                        }]}
                        onError={(err) => {
                            console.log(err)
                            setErrImg(true)
                        }}
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
        <Pressable style={[styles.container, dropShadowLight]} onPress={onImagePress}>
            {renderImage()}
            {friend && <Icon type='link' size={iconSize} color={colors.primary} pressColor={colors.secondary} style={styles.friend} />}
        </Pressable>
    )
}


interface ListProfileImageProp {
    image: ProfileImgProps | NewProfileImgProps | null;
    friend: boolean;
    onImagePress: () => void
}

export const ListProfileImage = ({ image, friend, onImagePress }: ListProfileImageProp) => {
    const [errImg, setErrImg] = useState<boolean>(false);

    const renderImage = () => {
        if (image && image.uri && !errImg) {
            const uri = image.cachedUrl ? image.cachedUrl : image.uri
            return (
                <Image
                    source={{ uri, cache: 'force-cache' }}
                    style={listStyles.image}
                    onError={(err) => {
                        console.log(err)
                        setErrImg(true)
                    }}
                />
            )
        }

        return <FontAwesome
            name="user-circle-o"
            color={colors.primary}
            style={listStyles.icon}
        />
    }

    return (
        <Pressable style={[listStyles.container, dropShadowListContainer, !image && listStyles.border]} onPress={onImagePress}>
            {renderImage()}
            {friend && <Icon type='link' size={15} color={colors.primary} pressColor={colors.secondary} style={listStyles.friend} />}
        </Pressable>
    )
}

const listStyles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    border: {
        borderColor: colors.primary,
        borderWidth: 1
    },
    friend: {
        position: 'absolute',
        transform: [
            {
                rotate: "90deg"
            }
        ],
        left: 5,
        top: 5
    },
    icon: {
        fontSize: 50,
        top: -25
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5
    }
})

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
        borderRadius: 50,
    }
})

const regularStyles = StyleSheet.create({
    container: {
        position: 'relative',
        height: windowWidth / 5,
        width: windowWidth / 5,
    },
    friend: {
        position: 'absolute',
        transform: [
            {
                rotate: "90deg"
            }
        ]
    },
    icon: {
        fontSize: windowWidth / 5.5
    },
    image_container: {
        flex: 1,
        // width: windowWidth / 5,
        // height: windowWidth / 5,
        borderRadius: 50
    }
})