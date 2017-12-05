/* eslint-disable flowtype-errors/show-errors,no-undef */
// @flow
import React, { Component } from 'react';
import { Button, Header, Modal, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import styles from './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { user: {}, modalOpen: false };
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

  render() {
    return (
      <div>
        <Modal trigger={<Button onClick={this.openModal}>Register</Button>} basic size="small" open={this.state.modalOpen}>
          <Header icon="archive" content="Register New Account" />
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input placeholder="First Name" />
                <Form.Input placeholder="Surname" />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input placeholder="Username" />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={this.closeModal}> Cancel </Button>
            <Button color="green" inverted> Register </Button>
          </Modal.Actions>
        </Modal>
        <div className={styles.container} data-tid="container">
          <h2>Welcome</h2>
          <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
        </div>
      </div>
    );
  }
}
