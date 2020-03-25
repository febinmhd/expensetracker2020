import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Amplify from 'aws-amplify';

import * as serviceWorker from './serviceWorker';

Amplify.configure({
    Auth:{
        mandatorySignId:true,
        region : process.env.REACT_APP_REGION,
        userPoolId : process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId : process.env.REACT_APP_APP_CLIENT_ID
    }
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
