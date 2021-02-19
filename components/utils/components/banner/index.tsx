import React from 'react';
import { StyleSheet, Dimensions, View, StyleProp } from "react-native"
import Item from './components/Item';
import { BannerDispatchActionProps, BannerItemProps } from '../../../../services/banner/tsTypes';
import { windowHeight, windowWidth } from '../../../../utils/variables';
import { normalize, colors } from '../../styles';

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

const bannerStyles = (type: string) => {
    interface StylesProps {
        container: StyleProp<any>
        text: StyleProp<any>
    }

    var styles: StylesProps = {
        container: {
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        text: {
            fontSize: normalize(11),
            letterSpacing: .5,
            textTransform: 'capitalize',
            marginLeft: 10,
            width: (windowWidth / 1.2),
            textAlign: 'center'
        }
    }

    switch (type) {
        case 'warning':
            styles.container.backgroundColor = colors.yellow
            styles.text.color = colors.white
            break;
        case 'error':
            styles.container.backgroundColor = colors.red
            styles.text.color = colors.white
            break;
        default:
            styles.container.backgroundColor = colors.green
            styles.text.color = colors.white
    }
    return styles
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