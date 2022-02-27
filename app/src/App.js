import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import ButtonAppBar from './components/AppBar/AppBar';
import Home from './components/Home/Home';
import CheckInStore from './components/CheckInStore/CheckInStore';
import CheckOut from './components/CheckOut/CheckOut';

const App = () => {
    return (
        <div>
            <ButtonAppBar />
            <BrowserRouter>
                <Routes>
                    <Route path="/checkInStore" element={<CheckInStore />} />
                    <Route path="/checkOut" element={<CheckOut />} />
                    <Route path="/" exact element={<Home />} />
                    {/* <Route component={Error}/> */}
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
