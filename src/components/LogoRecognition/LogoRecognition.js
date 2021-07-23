import React from 'react';
import './LogoRecognition.css';


    class LogoRecognition extends React.Component{
        render(){
            const {imageURL,logoBoxes,islogoDetected,hasError} = this.props;
            let LogoDetection;
            if(hasError===true)
            {
                LogoDetection = <span className="f4 fw6 db dark-red link pa3">Oops...Something went wrong</span>;
            }
            else{
            if(islogoDetected===false) {
                LogoDetection = <span className="f4 fw6 db dark-red link pa3">No Logo detected.. Try another image</span>;
            } else if(islogoDetected===true) {
                LogoDetection = logoBoxes.map((box,k) =>
                <div className="bounding-box" style={{top: box.topRow,left: box.leftCol, bottom: box.bottomRow, right: box.rightCol}} key={k}>
                <div className="bounding-box-concepts">
                    <div className="concept bounding-box__concept" role="button">
                        <span className="concept__name">{box.logoName}</span>
                        <span className="concept__prediction-val">{box.logoPrecision}</span>
                    </div>
                </div>
            </div>       
                );
            }
            }
            return (
                <div className='center ma'>
                    <div className="absolute mt2">
                    {LogoDetection}  
                    <img src={imageURL} alt='' width="700px" height="auto" id="inputImage"/>
                    </div>
                </div>
            )
    
        }
    }
    export default LogoRecognition;