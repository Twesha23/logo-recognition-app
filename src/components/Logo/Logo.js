import React from 'react';
import Tilt from 'react-tilt';
import logo from './logo-detection.svg';

const Logo = () => {
    return (
        <div>
            <Tilt className="Tilt fl w-30" options={{ max : 120 }} style={{ height: 200, width: 200 }} >
                <div className="Tilt-inner pa3 fl">
                    <img src={logo} alt='Logo'/>
                </div>
            </Tilt> 
            <div className="fl w-75 pa3 f3 b">
                <h1>
                        Logo Recognition App
                </h1> 
            </div> 
        </div>
    );
}

export default Logo;