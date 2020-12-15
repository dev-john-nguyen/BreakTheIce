import React from 'react'
import { View, FlatList, ActivityIndicator, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { NearUsersRootProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps } from '../../services/user/tsTypes';
import { HomeStackNavigationProp } from '../navigation/utils';
import { ProfilePage } from '../../utils/variables';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg } from '../../utils/svgs';

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

    handleNearUsersOnPress = (nearUser: UserRootStateProps) => {
        this.props.navigation.push(ProfilePage, {
            profileUid: nearUser.uid
        })
    }

    renderFlatList = () => {
        const { nearUsers, nearUsersFetched } = this.props
        if (!nearUsersFetched) return <ActivityIndicator />
        if (nearUsers.length < 1) return <Text>No Near By Users</Text>

        return <FlatList data={nearUsers} renderItem={({ item, index, separators }) => (
            <TouchableHighlight
                key={item.uid}
                onPress={() => this.handleNearUsersOnPress(item)}
                underlayColor='#99f3bd'
                style={styles.touchableContainer}
            >
                <View style={styles.userContainer}>
                    <View style={styles.profile}>
                        <SvgXml xml={userDefaultSvg} width='50' height='50' fill={'#28df99'} />
                        <Text>{item.name}</Text>
                        <Text>{item.age}</Text>
                    </View>
                    <Text style={styles.bioShort}>{item.bioShort}</Text>
                </View>
            </TouchableHighlight>
        )}
            keyExtractor={(item) => item.uid}
        />

    }

    render() {
        return (
            <View>
                {this.renderFlatList()}
            </View>
        )
    }
}

const mapStateToProps = (state: RootProps) => ({
    nearUsers: state.nearUsers.nearBy,
    nearUsersFetched: state.nearUsers.fetched
})

const styles = StyleSheet.create({
    touchableContainer: {
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: '#28df99',
        borderTopColor: '#28df99',
        marginBottom: 10,
        marginTop: 10
    },
    userContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 10,
        alignItems: 'center',
    },
    profile: {
        flexBasis: "30%",
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bioShort: {
        textAlign: 'center'
    }
})




export default connect(mapStateToProps, {})(NearByList);