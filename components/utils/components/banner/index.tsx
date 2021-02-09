import React from 'react';
import { StyleSheet, Dimensions, View } from "react-native"
import Item from './components/Item';
import { bannerStyles, colors } from '../../styles';
import { BannerDispatchActionProps, BannerItemProps } from '../../../../services/banner/tsTypes';
import { windowHeight } from '../../../../utils/variables';

interface BannerProps {
    remove_banner: BannerDispatchActionProps['remove_banner']
    banner: BannerItemProps[]
}

export default ({ remove_banner, banner }: BannerProps) => {
    return (
        <View style={styles.banner_container}>
            {banner.map((item, index) => {
                const itemStyles = bannerStyles(item.type)
                return <Item
                    key={item.id}
                    remove_banner={remove_banner}
                    item={item}
                    styles={itemStyles}
                />
            })}
        </View>
    )
}



const styles = StyleSheet.create({
    banner_container: {
        position: 'absolute',
        flexDirection: 'column-reverse',
        top: (windowHeight / 10),
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width)
    },
})