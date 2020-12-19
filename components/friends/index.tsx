import React from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { FriendsBottomTabNavProp } from '../navigation/utils';
import { FriendsRootProps, FriendObjProps } from '../../services/friends/tsTypes';
import { MeStackNavigationProp } from '../navigation/utils';
import { colors, profileStyles } from '../../utils/styles';
import { ProfileImg } from '../../utils/components';

interface FriendsProps {
    friends: FriendsRootProps;
    navigation: MeStackNavigationProp
}

const Friends = ({ friends, navigation }: FriendsProps) => {

    if (friends.users.length < 1) {
        return (
            <View style={{ flex: 1, alignContent: 'center', backgroundColor: 'green' }}>
                <Text>No Friends ... Go Get You Some</Text>
            </View>
        )
    }

    const handleOnFriendPress = (friend: FriendObjProps) => {
        navigation.push("Profile", {
            profileUid: friend.uid,
            title: friend.username
        })
    }

    return (
        <FlatList data={friends.users} renderItem={({ item, index, separators }) => (
            <TouchableHighlight
                key={item.uid ? item.uid : index.toString()}
                onPress={() => handleOnFriendPress(item)}
                underlayColor={colors.secondary}
                style={styles.container}
            >
                <View style={styles.content}>
                    <ProfileImg friend={true} />
                    <Text style={styles.username}>{item.username}</Text>
                </View>
            </TouchableHighlight>
        )}
            keyExtractor={(item, index) => item.uid ? item.uid : index.toString()}
        />
    )
}

const mapStateToProps = (state: RootProps) => ({
    friends: state.friends
})

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingLeft: 110,
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        marginTop: 20
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