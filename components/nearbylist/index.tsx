import React from 'react'
import { View, FlatList, ActivityIndicator, Text, TouchableHighlight, Pressable, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { NearUsersRootProps, NearByUsersProps } from '../../services/near_users/tsTypes';
import { HomeStackNavigationProp } from '../navigation/utils';
import { ProfilePage } from '../../utils/variables';
import { ListContainerStyle, colors } from '../../utils/styles';
import { ProfileImg } from '../../utils/components';

interface NearByListProps {
    navigation: HomeStackNavigationProp;
    nearUsers: NearUsersRootProps['nearBy'];
    nearUsersFetched: NearUsersRootProps['fetched'];
}

interface NearByListStateProps {

}


class NearByList extends React.Component<NearByListProps, NearByListStateProps> {
    constructor(props: NearByListProps) {
        super(props)

        this.state = {

        }
    }

    handleNearUsersOnPress = (nearUser: NearByUsersProps) => {
        this.props.navigation.push(ProfilePage, {
            profileUid: nearUser.uid,
            title: nearUser.username
        })
    }

    renderFlatList = () => {
        const { nearUsers, nearUsersFetched } = this.props
        if (!nearUsersFetched) return <ActivityIndicator />
        if (nearUsers.length < 1) return <Text>No Near By Users</Text>


        return <FlatList
            data={this.props.nearUsers}
            renderItem={({ item, index, separators }) => (
                <TouchableHighlight
                    key={item.uid}
                    onPress={() => this.handleNearUsersOnPress(item)}
                    underlayColor={colors.secondary}
                    style={ListContainerStyle.container}
                >
                    <View style={ListContainerStyle.content}>
                        <View style={ListContainerStyle.topLeft}>
                            <Text style={ListContainerStyle.topLeft_text}>{item.distance ? item.distance : 0} meters away</Text>
                        </View>
                        <View style={ListContainerStyle.profile_section}>
                            <ProfileImg friend={item.friend} />
                            <View style={ListContainerStyle.profile_section_text}>
                                <Text style={ListContainerStyle.username} numberOfLines={1}>{item.username ? item.username : 'RandomUser'}</Text>
                                <Text style={ListContainerStyle.age}>{item.age ? item.age : 0} years old</Text>
                            </View>
                        </View>
                        <View style={ListContainerStyle.content_section}>
                            <Text style={ListContainerStyle.content_section_text}>{item.bioShort ? item.bioShort : 'nothing ...'}</Text>
                            <View style={ListContainerStyle.content_section_buttons}>
                                <Pressable style={({ pressed }) => pressed ? ListContainerStyle.content_section_button_primary_pressed : ListContainerStyle.content_section_button_primary} >
                                    {({ pressed }) => (
                                        <Text style={ListContainerStyle.content_section_button_primary_text}>{item.friend ? 'Message' : item.sentInvite ? 'Pending' : 'Invite'}</Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            )}
            keyExtractor={(item) => item.uid}
        />


    }

    render() {
        return (
            <View style={style.container}>
                {this.renderFlatList()}
            </View>
        )
    }
}


const style = StyleSheet.create({
    container: {
        flex: 1,
    }
})

const mapStateToProps = (state: RootProps) => ({
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched
})

export default connect(mapStateToProps, {})(NearByList);