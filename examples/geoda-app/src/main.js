import React from 'react';
import document from 'global/document';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './app';
import store from './store/store';
//import "./main.css"

const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

render(<Root />, document.body.appendChild(document.createElement('div')));
