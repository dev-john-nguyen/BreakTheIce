import React from 'react';
import Base from './components';
import reducers from './services';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk, { ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { initFirebase } from './services/firebase/initFirebase';
import { verifyAuth } from './services/user/actions';
// import { firebase } from './services/firebase';

// //init FireStore Db
// export const fireDb = firebase.firestore()

const composeEnhancers = composeWithDevTools(applyMiddleware(reduxThunk))
const store = createStore(
  reducers,
  composeEnhancers
);

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof reducers>
export type AppThunk = ThunkAction<void, RootState, unknown, any>

function configureStore() {

  // //initalize firebase;
  // initFirebase()

  store.dispatch(verifyAuth())


  return store;
}

export default function App() {
  return (
    <Provider store={configureStore()}>
      <Base />
    </Provider>
  );
}
