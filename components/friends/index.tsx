import React from 'react';
import { View, FlatList, TouchableHighlight, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { FriendsRootProps, FriendObjProps } from '../../services/friends/types';
import { MeStackNavigationProp } from '../navigation';
import { colors, opacity_colors, normalize, dropShadowListContainer } from '../utils/styles';
import { CircleProfileImage } from '../profile/components/ProfileImage';
import Empty from '../utils/components/Empty';
import { BodyText } from '../utils';

interface FriendsProps {
    friends: FriendsRootProps;
    navigation: MeStackNavigationProp
}

const Friends = ({ friends, navigation }: FriendsProps) => {
    const handleOnFriendPress = (friend: FriendObjProps) => {
        navigation.push("Profile", {
            profileUid: friend.uid,
            title: friend.username
        })
    }

    return (
        <View style={styles.container}>
            {
                <FlatList
                    ListEmptyComponent={() => (
                        <Empty style={{ marginTop: 50 }}>Go Get Out There!</Empty>
                    )}
                    data={friends.users}
                    contentContainerStyle={styles.flat_list}
                    renderItem={({ item, index }) => (
                        <TouchableHighlight
                            key={item.uid ? item.uid : index.toString()}
                            onPress={() => handleOnFriendPress(item)}
                            underlayColor={opacity_colors.secondary_medium}
                            style={[styles.friend_container, dropShadowListContainer]}
                        >
                            <View style={styles.content}>
                                <CircleProfileImage friend={true} size='small' image={item.profileImg} onImagePress={() => handleOnFriendPress(item)} />
                                <BodyText style={styles.username}>{item.username}</BodyText>
                            </View>
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item, index) => item.uid ? item.uid : index.toString()}
                />
            }
        </View>
    )
}

const mapStateToProps = (state: RootProps) => ({
    friends: state.friends
})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flat_list: {
        paddingBottom: 100
    },
    friend_container: {
        padding: 10,
        paddingLeft: 110,
        backgroundColor: colors.white,
        marginBottom: 10,
        shadowColor: "#000"
    },
    content: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center'
    },
    username: {
        marginLeft: 20,
        fontSize: normalize(11),
        color: colors.primary,
        textAlign: 'center'
    }
})


export default connect(mapStateToProps, {})(Friends);