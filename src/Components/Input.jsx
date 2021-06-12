import React, { Component } from 'react';
import styled from 'styled-components';

const InputStyle = styled.input`
  width: auto;
  min-width: 100%;
  height: 100%;
  padding: 0 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  transition: all 0.4s ease;
  box-shadow: 0 0 10px rgba(0, 0, 10, 0.02) inset;
  &::placeholder {
    color: #888;
  }
  &:hover {
    border: 1px solid #0e71eb;
  }
`;
const TextareaStyle = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  box-shadow: 0 0 10px rgba(0, 0, 10, 0.02) inset;
  transition: all 0.4s ease;
  &::placeholder {
    color: #888;
  }
  &:hover {
    border: 1px solid #0e71eb;
  }
`;
const SelectStyle = styled.select`
  min-width: 110%;
  height: 100%;
  background: #fff;
  border: 1px solid #eee;
  padding: 10px 20px;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  box-shadow: 0 0 10px rgba(0, 0, 10, 0.02) inset;
  color: #888;
  transition: all 0.4s ease;
  &:hover {
    border: 1px solid #0e71eb;
  }
`;
const OptionStyle = styled.option`
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
`;
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tags: '',
      category: 'Entertainment',
      description: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.handleInput(e);
  }
  TextareaField() {
    return (
      <TextareaStyle
        onChange={this.handleChange}
        placeholder={this.props.placeholder}
        name={this.props.name}
        value={this.props.value}
      ></TextareaStyle>
    );
  }
  InputField() {
    return (
      <InputStyle
        onChange={this.handleChange}
        type={this.props.type}
        placeholder={this.props.placeholder}
        name={this.props.name}
        value={this.props.value}
      />
    );
  }
  SelectField() {
    return (
      <SelectStyle
        onChange={this.handleChange}
        type={this.props.type}
        name={this.props.name}
        value={this.props.value}
      >
        <OptionStyle disabled selected>
          {this.props.default}
        </OptionStyle>
        {this.props.options.map((option) => (
          <OptionStyle>{option}</OptionStyle>
        ))}
      </SelectStyle>
    );
  }
  RenderInput() {
    switch (this.props.type) {
      case 'textarea':
        return this.TextareaField();
        break;
      case 'select':
        return this.SelectField();
        break;
      default:
        return this.InputField();
        break;
    }
  }
  render() {
    return <div>{this.RenderInput()}</div>;
  }
}
