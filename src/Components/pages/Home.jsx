import React, { Component } from 'react';

export default class Home extends Component {
  handleClick() {
    fetch('/.netlify/functions/acquire')
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click</button>
      </div>
    );
  }
}
