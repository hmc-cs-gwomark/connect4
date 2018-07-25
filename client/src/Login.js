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
      success:false,
      openWait:false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({openWait:true});
  }


  render() {
    if (this.state.openWait){
      return (<Redirect to='/wait'/>)
    }
    return (
      <div className="form-div">
        <h1>Welcome To Connect4!</h1>
        <form className="reg-form" onSubmit={this.handleSubmit}>
          <input className="reg-form-field" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
          <input className="submit-button" type="submit" value="Play!"/>
        </form>
      </div>
    )
  }
}

export default withRouter(LoginForm);
