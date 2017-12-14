/* eslint-disable promise/catch-or-return,promise/always-return */
import React, { Component } from 'react';
import { Button, Form, Card, Icon, Image, Container, Loader, Grid, Modal, Text } from 'semantic-ui-react';
import imgur from 'imgur';
import fb from '../firebaseconfig';
import BattleTagGrid from './BattleTagGrid';

const database = fb.database();

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, loaded: false, Battletag: '', battleTags: [], showPicModal: false, photoUploading: false };
  }

  componentDidMount = () => {
    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        const test = fb.database().ref(`battletags/${user.uid}`);
        const battletags = [];
        test.on('value', (snap) => {
          battletags.length = 0;
          for (const i in snap.val()) {
            battletags.push({
              ref: i,
              uid: snap.val()[i].uid,
              battletag: snap.val()[i].battletag
            });
          }
        });
        this.setState({ loggedIn: true, loaded: true, battleTags: battletags });
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
    }).then(() => {
      this.forceUpdate();
    });
  };

  displayModal = () => {
    this.setState({ showPicModal: true });
  };

  hidePicModal = () => {
    this.setState({ showPicModal: false });
  };

  uploadFile = (event) => {
    const file = event.target.files[0];
    this.setState({ photoUploading: true });

    imgur.uploadFile(file.path).then((json) => {
      const url = json.data.link;

      fb.auth().currentUser.updateProfile({
        photoURL: url
      }).then(() => {
        this.setState({ photoUploading: false });
        this.hidePicModal();
        this.forceUpdate();
      });

      console.log(json.data.link);
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <Loader active inline="centered" inverted size="massive" />
      );
    }
    return (
      <Grid>
        <Grid.Column width={3} />
        <Grid.Column width={5}>
            <Card>
              <Image src={fb.auth().currentUser.photoURL} onClick={this.displayModal} />
              <Card.Content>
                <Card.Header>{fb.auth().currentUser.displayName}</Card.Header>
                <Card.Meta> {fb.auth().currentUser.email}</Card.Meta>
                <Card.Description>
                  Description will go here!
                </Card.Description>
              </Card.Content>
            </Card>
            <Form inverted>
              <Form.Group widths="equal">
                <Form.Input label="BattleTag" value={this.state.Battletag} onChange={this.updateBattletag} />
              </Form.Group>
              <Button onClick={this.addBattletag}> Add BattleTag </Button>
            </Form>
            <Modal basic size="small" open={this.state.showPicModal}>
              <Modal.Content>
                <Form.Input type="file" onChange={this.uploadFile} loading={this.state.photoUploading} />
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" inverted onClick={this.hidePicModal}> Cancel </Button>
              </Modal.Actions>
            </Modal>
        </Grid.Column>
        <Grid.Column width={5}>
          <Container textAlign="center">
            <BattleTagGrid battletags={this.state.battleTags} />
          </Container>
        </Grid.Column>
      </Grid>
    );
  }
}
