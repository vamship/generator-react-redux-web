/**
 * Main entry point for the application. Bootstrap react components and
 * application css files here.
 */
import { Promise } from 'bluebird';
import React from 'react';
import { render } from 'react-dom';
import initReactFastclick from 'react-fastclick';

// This is required. See:
// http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
import 'babel-polyfill';

import createStore, { storeReady } from './redux';
import AppRootComponent from './components/app-root-component';
import '../css/app.css';

const store = createStore();
const readyToRender = Promise.all([storeReady]);

initReactFastclick();
render(
    <AppRootComponent store={ store } readyToRender={ readyToRender } />,
    document.getElementById('appRoot')
);
