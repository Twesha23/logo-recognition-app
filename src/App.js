import { Component } from 'react';
import Particles from 'react-particles-js';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import LogoRecognition from './components/LogoRecognition/LogoRecognition';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1000
      }
    }
  }
}



 const initialstate = {
  input: '',
  imageURL: '',
  logoBoxes: [],
  islogoDetected:null,
  route: 'login',
  isLoggedIn: false,
  hasError:false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joiningDate: ''
 }

}

class App extends Component {
  constructor(){
    super();
    this.state = initialstate;
 }

  componentDidMount(){
    fetch('https://sleepy-cliffs-47554.herokuapp.com/')
      .then(response => response.json())
      .then(console.log)
      .catch(error => console.error('Error encountered: ', error));
  }

  onRouteChange = (route) => {
      
      if(route === 'home')
        this.setState({isLoggedIn: true});
      else
      {
        //this.setState({isLoggedIn: false});
        this.setState(initialstate);
      }
      this.setState({route: route});
  }
  
  loadUser = (data) => {
    this.setState({user : {
      id: data._id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joiningDate: data.joiningDate
    }})
    console.log(this.state.user)
  }
  


  calculatelogoBoxSize = (regions) => {
    const boxes = [];
    const image = document.getElementById('inputImage');
    const width = image.width;
    const height = image.height;
    regions.forEach(region => {
      const clarifailogoBox = region.region_info.bounding_box;
      const logo=region.data.concepts[0];
      boxes.push({
        topRow: clarifailogoBox.top_row * height,
        leftCol: clarifailogoBox.left_col * width,
        bottomRow: height - (clarifailogoBox.bottom_row * height),
        rightCol: width - (clarifailogoBox.right_col * width),
        logoName:logo.name,
        logoPrecision:logo.value,
      });
    });
    this.setState({logoBoxes : boxes});
    console.log(boxes);
  }

  onInputChange= (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('https://sleepy-cliffs-47554.herokuapp.com/imageURL', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                imageURL: this.state.input
            })
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      if(typeof(response)=== "string" && response.includes('Error')){
        this.setState({hasError:true});
        console.error("Error encountered:",response);
      }
      const regions = response.outputs[0].data.regions;
      if(regions){
        fetch('https://sleepy-cliffs-47554.herokuapp.com/imageEntry', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: this.state.user,
                logos_detected: regions.length
            })
            })
            .then(response => response.json())
            .then(count => {
                this.setState(Object.assign(this.state.user,{entries: count}))      
            })
            .catch(error => console.error('Error encountered: ', error));
        this.setState({islogoDetected: true});
        this.calculatelogoBoxSize(regions);
      } 
      else{
        this.setState({logoBoxes: [], islogoDetected: false});
      }
      })
    .catch(err => console.error('Error encountered:', err));
  }

  render(){
    const { imageURL, logoBoxes, route, isLoggedIn , islogoDetected} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>
        <Navigation isLoggedIn={isLoggedIn} onRouteChange={this.onRouteChange}/>
        <Logo/>
        { 
          route === 'home' ? 
          <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <LogoRecognition imageURL={imageURL} logoBoxes={logoBoxes} islogoDetected={islogoDetected} hasError={this.state.hasError}/>
          </div>
          : ( route === 'login' ? 
              <Login onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : <Registration onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
        </div>
    );
  }
}

export default App;
