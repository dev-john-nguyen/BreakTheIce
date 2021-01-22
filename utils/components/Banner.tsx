import React from 'react';
import { Pressable, View, StyleSheet, Dimensions } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { bannerStyles } from "../styles"
import { UtilsRootStateProps } from '../../services/utils/tsTypes';
import { BodyText } from '.';

interface BannerProps {
    handleRemoveBanner: () => void;
    banner: UtilsRootStateProps['banner']
}

export default ({ handleRemoveBanner, banner }: BannerProps) => (
    <Pressable onPress={handleRemoveBanner} style={styles.banner_container}>
        <FlatList
            data={banner}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
                const styles = bannerStyles(item.type)
                return (
                    <View style={styles.container}>
                        <BodyText styles={styles.text} text={item.message} />
                    </View>
                )
            }}
        />
    </Pressable>

)


const styles = StyleSheet.create({
    banner_container: {
        position: 'absolute',
        top: 40,
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width)
    },
})