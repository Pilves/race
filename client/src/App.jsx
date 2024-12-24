import React, {createContext} from 'react';
import {BrowserRouter} from 'react-router-dom';
import AppRouter from './router/router';
import {io} from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:8080');
export const SocketContext = createContext(null);

function App() {
    return (
        <BrowserRouter>
             <AppRouter/>
        </BrowserRouter>
    )
}

export {socket};
export default App;
