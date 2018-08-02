import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';


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


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      validUser:false,
      openWait:false,
      error:false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // Handles change of form input
  handleChange(event) {
    var validUser = true;
    $.getJSON('/connect4/api/users')
    .done(function() {
      validUser = false;
    })

    this.setState({'username': event.target.value, 'success':success});
  }


  //Handles form submit
  handleSubmit(event) {
    event.preventDefault();

    // if succuesfull post then open wait
    // if not say unable to create user
    if (this.state.success) {
      $.post('/connect4/api/users', { username: username })
      .done(function() {
        this.setState({'openWait': true});
      })
      .fail(function() {
        this.setState({'error': true})
      })
    }

  }


  render() {
    if (this.state.openWait){
      return (<Redirect to='/wait'/>)
    }

    // Display an error message if the client is already playing a game
    var errorMessage = false;
    if (!this.state.validUser || !this.state.error) {
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

export default withRouter(LoginForm);
