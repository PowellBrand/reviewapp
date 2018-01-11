import {createStore, applyMiddleware} from 'redux';
import reducer from './ducks/users';
//need this because of the axios requests.
import promiseMiddleware from 'redux-promise-middleware';

export default createStore(reducer, applyMiddleware( promiseMiddleware() ));