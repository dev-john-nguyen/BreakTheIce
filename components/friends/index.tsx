import React from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { FriendsRootProps, FriendObjProps } from '../../services/friends/types';
import { MeStackNavigationProp } from '../navigation/utils/types';
import { colors } from '../../utils/styles';
import { UnderlineHeader } from '../../utils/components';
import ProfileImage from '../profile/components/ProfileImage';

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
                friends.users.length > 0 ?
                    <FlatList
                        data={friends.users}
                        renderItem={({ item, index }) => (
                            <TouchableHighlight
                                key={item.uid ? item.uid : index.toString()}
                                onPress={() => handleOnFriendPress(item)}
                                underlayColor={colors.secondary}
                                style={styles.friend_container}
                            >
                                <View style={styles.content}>
                                    <ProfileImage friend={true} size='regular' image={item.profileImg} />
                                    <Text style={styles.username}>{item.username}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                        keyExtractor={(item, index) => item.uid ? item.uid : index.toString()}
                    /> :
                    <UnderlineHeader text='Get Out There!' styles={{ marginTop: 20 }} />
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
    friend_container: {
        padding: 10,
        paddingLeft: 110,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        marginBottom: 20
    },
    content: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        marginLeft: 20,
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center'
    }
})


export default connect(mapStateToProps, {})(Friends);