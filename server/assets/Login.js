import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';

var server_url = 'http://localhost:5000';


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      validUser: true,
      openWait: false,
      error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setValidUser = this.setValidUser.bind(this);
  }

  setValidUser(validUser, username) {
    this.setState({validUser: validUser, username:username})
  }

  // Handles change of form input
  handleChange(event) {
    event.preventDefault()
    var validUser;
    var username = event.target.value;

    axios.get(server_url+'/connect4/api/users/')
    .then( (response) => {
      console.log(response.data);
      validUser = false;
      this.setValidUser(validUser, username);
    } )
    .catch( (error) => {
      validUser = true;
      console.log(validUser, username)
      this.setValidUser(validUser, username);
    })
  }



  //Handles form submit
  handleSubmit(event) {
    event.preventDefault();

    // if succuesfull post then open wait
    // if not say unable to create user
    if (this.state.validUser) {
      console.log("STUPID STUPID")
      axios.post(server_url+'/connect4/api/users/', { 
        username: event.target.value
      })
      .then((response) => {
        this.setState({'openWait': true});
      })
      .catch((error) => {
        this.setState({'error': true})
      })
    }

  }

  

  render() {
    if (this.state.openWait){
      return (<Redirect to='/wait'/>)
    }

    // Display an error message if the client is already playing a game
    var errorMessage = (<h3> </h3>);
    if (!this.state.validUser || this.state.error) {
      errorMessage = <h3>User with this IP already palying</h3>
    }

    return (
      <div className="form-div">
        <h1>Welcome To Connect4!</h1>
        <form className="reg-form" onSubmit={this.handleSubmit}>
          <input className="reg-form-field" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
          <input className="submit-button" type="submit" value="Play!"/>
        </form>
        {errorMessage}
      </div>
    )
  }
}

//----------------//
// ANIMATION CODE //
//----------------//

// const RedCircle = (props) => <div style={props.style} className="red-circle">
//   </div>

// const MovingCircle = (props) => {
//   return (<Motion
//     defaultStyle={{translateX: 0, translateY: 0}}
//     style={{translateX: spring(100, {stiffness:10, damping:48}), translateY: spring(100, {stiffness:10, damping:48})}}>
//     {({translateX, translateY}) =>
//       <RedCircle style={{
//         WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0)`,
//         transform: `translate3d(${translateX}px, ${translateY}px, 0)`
//       }} />
//     }
//   </Motion>)
// }

// class MovingCircle extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       nextCoords: [0, 0]
//     }
//     this.getNewCoords = this.getNewCoords.bind(this);
//   }

//   getNewCoords() {
//     // Get new coordinates and make sure they are within the window
//     // set the nextCoords in the state
//     Math.floor(Math.random() * 20);
//   }

// }

//----------------//
//  END ANIMATION //
//----------------//

export default withRouter(LoginForm);
