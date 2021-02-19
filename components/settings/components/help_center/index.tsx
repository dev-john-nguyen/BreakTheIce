import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { BodyText } from '../../../utils';
import { colors, normalize } from '../../../utils/styles';
import { UserDispatchActionsProps } from '../../../../services/user/types';
import PrivatePolicy from './components/PrivatePolicy';
import RemoveAccount from './components/RemoveAccount';
import Contact from './components/Contact';
import Tips from './components/Tips';


interface HelpCenterProps {
    remove_account: UserDispatchActionsProps['remove_account'];
}

enum ContentOptions {
    tips = 'tips',
    policy = 'policy',
    contact = 'contact',
    remove = 'remove'
}

export default ({ remove_account }: HelpCenterProps) => {
    const [content, setContent] = useState(ContentOptions.tips)

    const renderContent = () => {
        switch (content) {
            case ContentOptions.tips:
                return <Tips />
            case ContentOptions.policy:
                return <PrivatePolicy />
            case ContentOptions.contact:
                return <Contact />
            case ContentOptions.remove:
                return <RemoveAccount remove_account={remove_account} />
            default:
                return <PrivatePolicy />
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <View style={styles.menu_container}>
                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.tips && styles.active]}
                        onPress={() => setContent(ContentOptions.tips)}
                    >
                        <BodyText style={styles.menu_text}>Help</BodyText>
                    </Pressable>

                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.policy && styles.active]}
                        onPress={() => setContent(ContentOptions.policy)}
                    >
                        <BodyText style={styles.menu_text}>Private Policy</BodyText>
                    </Pressable>

                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.contact && styles.active]}
                        onPress={() => setContent(ContentOptions.contact)}
                    >
                        <BodyText style={styles.menu_text}>Contact Us</BodyText>
                    </Pressable>

                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.remove && styles.active]}
                        onPress={() => setContent(ContentOptions.remove)}
                    >
                        <BodyText style={styles.menu_text}>Remove Account</BodyText>
                    </Pressable>

                </View>
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    menu: {
        flex: .2,
    },
    active: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2
    },
    content: {
        flex: .8,
    },
    menu_container: {

    },
    menu_item: {
        padding: 5,
        margin: 5,
        alignItems: 'center'
    },
    menu_text: {
        fontSize: normalize(10),
        textAlign: 'center'
    }
})