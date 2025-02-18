import React, { useState, useEffect } from 'react'
import './styles/Meetings.css'
import { Outlet } from 'react-router-dom';
import Nav1 from './Nav1'

const Meetings = () => {

    return (
        <div className='meeting-container'>
            <div className='nav-container'>
                <Nav1/>
            </div>
            <div className='main-content'>
                <Outlet />
            </div>
        </div>
    )
}

export default Meetings