import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

// Middlewares
// TODO Useful ?
// import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';


// TODO Preload store ?
const preloadedStore = {};


/*
|---------------------------------------------------------
|		Middlewares
|---------------------------------------------------------
*/

export const ASYNC_SUFFIXES = {
	loading: 'LOADING',
	success: 'SUCCESS',
	error: 'ERROR',
};

const middlewares = [
	// thunk,
	createPromise({ promiseTypeSuffixes: Object.values(ASYNC_SUFFIXES) }),
];

if (process.env.NODE_ENV === 'development')
	middlewares.push(require('redux-logger').createLogger({ collapsed: true }));


const enhancers = applyMiddleware(...middlewares);


/*
|---------------------------------------------------------
|		Store
|---------------------------------------------------------
*/

const store = createStore(rootReducer, preloadedStore, enhancers);

export default store;
