import React from 'react';
import { View, FlatList, TouchableHighlight, Text } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { FriendsBottomTabNavProp } from '../navigation/utils';
import { FriendsRootProps, FriendObjProps } from '../../services/friends/tsTypes';
import { HomeScreenOptions } from '../navigation/utils'

interface FriendsProps {
    friends: FriendsRootProps;
    navigation: any
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
        // navigation.navigate('Home',
        //     {
        //         screen: HomeScreenOptions.Profile,
        //         params: { profileUid: friend.uid }
        //     })
        navigation.push("Profile", { profileUid: friend.uid })
    }

    return (
        <View>
            <FlatList data={friends.users} renderItem={({ item, index, separators }) => (
                <TouchableHighlight
                    key={item.uid}
                    onPress={() => handleOnFriendPress(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}
                >
                    <View>
                        <Text>{item.dateCreated.toString()}</Text>
                        <Text>{item.active}</Text>
                    </View>
                </TouchableHighlight>
            )}
                keyExtractor={(item) => item.uid}
            />
        </View>
    )
}

const mapStateToProps = (state: RootProps) => ({
    friends: state.friends
})


export default connect(mapStateToProps, {})(Friends);