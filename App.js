import React from 'react';
import { Image, Button, TouchableOpacity, StyleSheet, Text, View, ListView } from 'react-native';
import Exponent from 'exponent';

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

// components
import FindsView from './components/FindsView';
import EmptyState from './components/EmptyState';

// root reducer
import rootReducer from './reducers/rootReducer';

// actions
import { pickImage, takePhoto, initializeApp } from './actions';

const loggerMiddleware = createLogger();

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    info: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#dcdcdc',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1
    },
    image: {
        width: 180,
        height: 180,
        borderRadius: 5
    },
    buttons: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    cameraRoll: {
        width: 80,
        height: 80,
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#FF8724',
        borderRadius: 40
    },
    buttonIcon: {
        overflow: 'hidden',
        width: 40,
        height: 40
    },
    spacer: {
        width: 60,
        height: 60,
        margin: 30
    },
    takePhoto: {
        width: 80,
        height: 80,
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#FF8724',
        borderRadius: 80
    }
});

const mapStateToProps = (state) => ({
    image: state.image,
    finds: state.finds,
    init: state.init
});

const Home = connect(
    mapStateToProps
)(({ image, finds, init, dispatch }) => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let findDS = ds.cloneWithRows(finds);

    console.log(finds);

    if(init == false) {
        dispatch(initializeApp());
    }

    const tableOrEmpty = (finds.length === 0 ? <EmptyState /> : <FindsView ds={findDS} />);

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                { image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
            {tableOrEmpty}
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.cameraRoll} onPress={() => dispatch(pickImage())}>
                    <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/fonty-166bc.appspot.com/o/icons%2Fphotos.png?alt=media&token=a98f273a-035b-4f98-a8a7-065ad1c1691b'}} style={styles.buttonIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.spacer} onPress={() => {}} />
                <TouchableOpacity style={styles.takePhoto} onPress={() => dispatch(takePhoto())}>
                    <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/fonty-166bc.appspot.com/o/icons%2Fcamera.png?alt=media&token=9183d721-3368-4895-9988-b9ef3f22ecb3'}} style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default class App extends React.Component {
    render() {
        return (
          <Provider store={store}>
              <Home />
          </Provider>
        );
    }
}

Exponent.registerRootComponent(App);
