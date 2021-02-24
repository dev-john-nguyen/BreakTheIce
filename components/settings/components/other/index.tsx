import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { BodyText } from '../../../utils';
import { colors, normalize, dropShadow } from '../../../utils/styles';
import { UserDispatchActionsProps } from '../../../../services/user/types';
import PrivatePolicy from './components/PrivatePolicy';
import RemoveAccount from './components/RemoveAccount';
import Contact from './components/Contact';
import Tips from './components/Tips';
import CommunityGuide from './components/CommunityGuide';
import TermsOfUse from './components/TermsOfUse';
import { ScrollView } from 'react-native-gesture-handler';

interface HelpCenterProps {
    remove_account: UserDispatchActionsProps['remove_account'];
}

enum ContentOptions {
    tips = 'tips',
    policy = 'policy',
    contact = 'contact',
    community = 'community',
    terms = 'terms',
    remove = 'remove'
}

export default ({ remove_account }: HelpCenterProps) => {
    const [content, setContent] = useState(ContentOptions.tips)

    const renderContent = () => {
        switch (content) {
            case ContentOptions.terms:
                return <TermsOfUse />
            case ContentOptions.community:
                return <CommunityGuide />
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
                <ScrollView style={[styles.menu_container, dropShadow]}>
                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.tips && styles.active]}
                        onPress={() => setContent(ContentOptions.tips)}
                    >
                        <BodyText style={styles.menu_text}>Safety Tips</BodyText>
                    </Pressable>

                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.terms && styles.active]}
                        onPress={() => setContent(ContentOptions.terms)}
                    >
                        <BodyText style={styles.menu_text}>Terms of Use</BodyText>
                    </Pressable>

                    <Pressable
                        style={[styles.menu_item, content === ContentOptions.community && styles.active]}
                        onPress={() => setContent(ContentOptions.community)}
                    >
                        <BodyText style={styles.menu_text}>Community Guidelines</BodyText>
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
                </ScrollView>
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
        flexDirection: 'column'
    },
    active: {
        backgroundColor: colors.primary,
    },
    content: {
        flex: 1,
        padding: 10
    },
    menu: {
        flex: .1,
        marginBottom: 10
    },
    menu_container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: colors.white,
        width: '60%',
        alignSelf: 'center',
    },
    menu_item: {
        padding: 5,
    },
    menu_text: {
        fontSize: normalize(10),
        textAlign: 'center'
    }
})