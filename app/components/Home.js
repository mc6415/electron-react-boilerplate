/* eslint-disable flowtype-errors/show-errors,no-undef */
// @flow
import React, { Component } from 'react';
import { Button, Header, Modal, Form, Icon, Dimmer } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import styles from './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { user: { email: '', password: '', username: '', firstname: '', surname: '' },
      login: { username: '', password: '' },
      modalOpen: false,
      openLogin: false,
      showDimmer: false };
  }

  componentDidMount() {
    const self = this;
    ipcRenderer.on('last-imports', (event, data) => {
      console.log(data);
      self.setState({ imports: data });
    });

    ipcRenderer.on('UserAdded', (event) => {
      this.closeModal();
      this.setState({ showDimmer: true });
    });
  }

  onButtonClick = () => {
    ipcRenderer.send('test');
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal =() => {
    this.setState({ modalOpen: false });
  };

  showLogin = () => {
    this.setState({ openLogin: true });
  };

  closeLogin = () => {
    this.setState({ openLogin: false });
  };

  registerUser = () => {
    ipcRenderer.send('registerUser', this.state.user);
  };

  loginUser = () => {
    ipcRenderer.send('loginUser', this.state.login);
  }

  updateLoginUsername = (event) => {
    const login = this.state.login;
    login.username = event.target.value;
    this.setState({ login });
  }

  updateLoginPassword = (event) => {
    const login = this.state.login;
    login.password = event.target.value;
    this.setState({ login });
  }

  updateFirstname = (event) => {
    const user = this.state.user;
    user.firstname = event.target.value;
    this.setState({ user });
  }

  updateSurname = (event) => {
    const user = this.state.user;
    user.surname = event.target.value;
    this.setState({ user });
  }

  updateUsername = (event) => {
    const user = this.state.user;
    user.username = event.target.value;
    this.setState({ user });
  }

  updatePassword = (event) => {
    const user = this.state.user;
    user.password = event.target.value;
    this.setState({ user });
  }

  updateEmail = (event) => {
    const user = this.state.user;
    user.email = event.target.value;
    this.setState({ user });
  };

  closeDimmer = () => {
    this.setState({ showDimmer: false });
  }

  render() {
    return (
      <div>
        <Dimmer active={this.state.showDimmer} onClickOutside={this.closeDimmer} page>
          <Header as="h2" icon inverted>
            <Icon name="check circle outline" color="green" />
            Welcome Aboard!
            <Header.Subheader>Click anywhere to close</Header.Subheader>
          </Header>
        </Dimmer>
        <Modal basic size="small" open={this.state.openLogin}>
          <Header icon="user" content="Login" />
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input placeholder="username" value={this.state.login.username} onChange={this.updateLoginUsername} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input placeholder="password" type="password" value={this.state.login.password} onChange={this.updateLoginPassword} />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={this.closeLogin}> Cancel </Button>
            <Button color="green" inverted onClick={this.loginUser}> Login </Button>
          </Modal.Actions>
        </Modal>
        <Modal basic size="small" open={this.state.modalOpen}>
          <Header icon="archive" content="Register New Account" />
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input placeholder="First Name" value={this.state.user.firstname} onChange={this.updateFirstname} />
                <Form.Input placeholder="Surname" value={this.state.user.surname} onChange={this.updateSurname} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input placeholder="Username" value={this.state.user.username} onChange={this.updateUsername} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input type="password" placeholder="Password" value={this.state.user.password} onChange={this.updatePassword} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input type="email" placeholder="Email" value={this.state.user.email} onChange={this.updateEmail} />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={this.closeModal}> Cancel </Button>
            <Button color="green" inverted onClick={this.registerUser}> Register </Button>
          </Modal.Actions>
        </Modal>
        <div className="ui middle aligned center aligned grid">
          <div className="column">
            <Header as="h2" icon inverted>
              <Icon name="home" />
              Welcome
              <Header.Subheader>
                Here you can either <Button inverted onClick={this.showLogin}>Login</Button> or
                <Button onClick={this.openModal} inverted>Register</Button>
              </Header.Subheader>
            </Header>
          </div>
        </div>
      </div>
    );
  }
}
