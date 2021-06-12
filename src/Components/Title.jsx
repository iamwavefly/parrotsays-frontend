import React, { Component } from 'react';
import styled from 'styled-components';

const TitleStyle = styled.h1`
  font-size: 24px;
  color: #333;
  width: 100%;
  text-align: center;
  font-weight: 500;
  margin-bottom: 30px;
`;

export default class Title extends Component {
  render() {
    return <TitleStyle>{this.props.children}</TitleStyle>;
  }
}
