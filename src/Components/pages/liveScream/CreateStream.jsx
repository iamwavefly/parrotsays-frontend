import React, { Component } from 'react';
import Button from '../../Button';
import Title from '../../Title';
import MainHeader from './MainHeader';
import styled from 'styled-components';
import Input from '../../Input';
import Axios from 'axios';

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align: center;
  justify-content: center;
`;
const FormStyle = styled.form`
  width: 30%;
  height: auto;
  min-height: 10rem;
  display: grid;
  grid-auto-rows: 48px;
  grid-gap: 10px;
  margin: 0 auto;
`;

export default class CreateStream extends Component {
  constructor(props) {
    super(props);
    let params = new URLSearchParams(window.location.search);
    this.state = {
      streamCategories: ['Entertainment', 'Education', 'Romance'],
      username: params && params.get('username'),
      userId: params && params.get('user_id'),
      title: '',
      tags: '',
      category: '',
      description: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.createStream = this.createStream.bind(this);
  }
  async createStream() {
    const stream = await Axios.post(
      'http://localhost:4000/stream/new',
      this.state
    );
    console.log(stream);
    stream.statusText === 'Created' &&
      this.props.history.push(
        `/stream/new/?username=${this.state.username}&user_id=${this.state.userId}/stream_id=${stream.data.payload._id}`
      );
  }
  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  render() {
    return (
      <div>
        <MainHeader />
        <Container>
          <Title>Create New Stream</Title>
          <FormStyle>
            <Input
              handleInput={this.handleInput}
              type="text"
              value={this.state.title}
              placeholder="Enter stream title"
              name="title"
            />
            <Input
              handleInput={this.handleInput}
              type="text"
              value={this.state.tags}
              placeholder="Stream Tags"
              name="tags"
            />
            <Input
              type="select"
              handleInput={this.handleInput}
              default="Select Stream Category"
              options={this.state.streamCategories}
              name="category"
              value={this.state.category}
            />
            <Input
              type="textarea"
              handleInput={this.handleInput}
              placeholder="Enter stream description"
              name="description"
              value={this.state.description}
            />
            <Button submitForm={this.createStream}>Start Stream</Button>
          </FormStyle>
        </Container>
      </div>
    );
  }
}
