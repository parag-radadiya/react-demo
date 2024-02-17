import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import mixpanel from 'mixpanel-browser';
import { v4 as uuid } from 'uuid';


mixpanel.init("7553eda3bce12685244e7815408fa7ae", { debug: true, track_pageview: true, persistence: 'localStorage' });
const uid  = localStorage.getItem("uid")
if(uid) {
    mixpanel.identify(uid)
} else {
    const unique_id = uuid();
    localStorage.setItem("uid", unique_id)
    mixpanel.identify(unique_id)
    mixpanel.track('Sign Up', {
        'uid': unique_id
    })
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
