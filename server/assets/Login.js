import { Component } from 'react';
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



export default withRouter(LoginForm);
