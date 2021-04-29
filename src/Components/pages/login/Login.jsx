import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMsg } from '../../../action/addMsg';
import '../../../styles/login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      streamName: '',
      username: '',
      role: '',
      formCompleted: false,
    };
    this.handleOnchange = this.handleOnchange.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleOnchange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(this.state.streamName, this.state.username, this.state.role);
  }
  checkFields() {
    if (
      this.state.streamName &&
      this.state.username &&
      this.state.role === null
    ) {
      return true;
    } else {
      return false;
    }
  }
  handleSubmit(e) {
    if (this.checkFields()) {
      this.setState({ formFilled: true });
      return e.preventDefault();
    }
    let userAuth = {
      username: this.state.username,
      channel: this.state.streamName,
    };
    localStorage.setItem('userAuth', JSON.stringify(userAuth));
  }
  render() {
    return (
      <div className="loginContainer">
        <form onSubmit={this.handleSubmit} action="/stream">
          <input
            type="text"
            placeholder="Stream Name"
            name="streamName"
            value={this.state.streamName}
            onChange={this.handleOnchange}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={this.state.username}
            onChange={this.handleOnchange}
          />
          <input
            type="text"
            placeholder="Enter Role"
            name="role"
            value={this.state.role}
            onChange={this.handleOnchange}
          />
          {this.state.streamName === '' ||
          this.state.username === '' ||
          this.state.role === '' ? (
            <input name="submitBtn" disabled type="submit" value="Go Live" />
          ) : (
            <input name="submitBtn" type="submit" value="Go Live" />
          )}
        </form>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addNewMsg: (msg) => {
      dispatch(addMsg(msg));
    },
  };
};

export default connect(null, mapDispatchToProps)(Login);
