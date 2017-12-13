/* eslint-disable flowtype-errors/show-errors,promise/always-return,promise/catch-or-return */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Header, Icon, Button, Form, Container } from 'semantic-ui-react';
import config from '../firebaseconfig';
import fb from '../firebaseconfig';
import styles from './Home.css';
import ErrorMessage from './ErrorMessage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '', showSignUp: false, errorMessage: '', showErrorMessage: false };
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  signUp = () => {
    fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => { console.log(user); })
      .catch((err) => {
        this.setState({ showErrorMessage: true, errorMessage: err.message });
      });
  };

  login = () => {
    fb.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => { this.props.history.push('/profile'); });
  };

  render() {
    return (
      <div>
        <Container textAlign="center">
          <Header as="h1" icon inverted>
            <Icon name="home" />
          Welcome
            <Header.Subheader>This is a very quick sample application for Electron using Firebase</Header.Subheader>
          </Header>

          { this.state.showErrorMessage
            ? <ErrorMessage style={{ marginBottom: '15px' }} message={this.state.errorMessage} />
            : null }

          <Form inverted>
            <Form.Group widths="equal">
              <Form.Input label="Email" placeholder="Email" value={this.state.email} onChange={this.onEmailChange} />
              <Form.Input label="Password" type="Password" value={this.state.password} onChange={this.onPasswordChange} />
            </Form.Group>
          </Form>

          <Button animated inverted onClick={this.signUp}>
            <Button.Content visible> Sign Up </Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>

          <Button animated inverted onClick={this.login}>
            <Button.Content visible> Login </Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </Container>
      </div>
    );
  }
}

export default withRouter(Home);
