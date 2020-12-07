import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Login from './login';
import Home from './home';
import { RootProps } from '../services';
import { UtilsRootStateProps } from '../services/utils/tsTypes';
import { UserRootStateProps } from '../services/user/tsTypes';

const Base: React.FC<UtilsRootStateProps & UserRootStateProps> = ({ error, loading, uid }) => {
    const handleRender = () => {
        if (loading) return <ActivityIndicator />
        if (error) return <Text>{error}</Text>
        if (uid) { return <Home /> } else { return <Login /> }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {handleRender()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    }
});

const mapStateToProps = (state: RootProps) => ({
    error: state.utils.error,
    loading: state.utils.loading,
    uid: state.user.uid
})

// Base.propTypes = {
//     error: PropTypes.string.isRequired,
//     loading: PropTypes.bool.isRequired,
//     uid: PropTypes.string.isRequired
// }

export default connect(mapStateToProps, {})(Base)