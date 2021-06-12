import React, { Component } from 'react';
import styled from 'styled-components';

const ButtonStyle = styled.button`
  position: relative;
  top: 40px;
  width: 110%;
  height: 90%;
  font-size: 16px;
  color: #fff;
  background-color: #0e71eb;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 20, 0.1);
  opacity: 1;
  transition: all 0.4 ease;
  &:hover {
    opacity: 0.8;
  }
`;

export default class Button extends Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e) {
    e.preventDefault();
    this.props.submitForm();
  }
  render() {
    return (
      <ButtonStyle onClick={this.handleClick}>
        {this.props.children}
      </ButtonStyle>
    );
  }
}
