import React, { Component } from 'react';
import { Button, Form, Card, Icon, Image, Container, Loader } from 'semantic-ui-react';
import fb from '../firebaseconfig';

const database = fb.database();

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, loaded: false, Battletag: '' };
  }

  componentWillMount = () => {
    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true, loaded: true });
      } else {
        this.setState({ loggedIn: false, loaded: false });
      }
    });
  };

  updateBattletag = (event) => {
    this.setState({ Battletag: event.target.value });
  };

  addBattletag = () => {
    database.ref(`battletags/${fb.auth().currentUser.uid}`).push({
      uid: fb.auth().currentUser.uid,
      battletag: this.state.Battletag
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <Loader active inline="centered" inverted size="massive" />
      );
    }
    return (
      <Container textAlign="center">
        <Card
          image="https://conferencecloud-assets.s3.amazonaws.com/default_avatar.png"
          header={fb.auth().currentUser.displayName}
          meta={fb.auth().currentUser.email}
          description="Description will go here later!"
        />

        <Form>
          <Form.Group>
            <Form.Input label="BattleTag" value={this.state.Battletag} onChange={this.updateBattletag} />
            <Button onClick={this.addBattletag}> Add BattleTag </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
