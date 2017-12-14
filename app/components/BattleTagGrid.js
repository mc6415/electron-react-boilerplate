import React, { Component } from 'react';
import { Image, List, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import fb from '../firebaseconfig';

export default class BattleTagGrid extends Component {
  static propType = {
    battletags: PropTypes.array.isRequired
  };

  deleteNode = (node) => {
    fb.database().ref(`/battletags/${node.uid}/${node.ref}`).remove();
    this.forceUpdate();
  }

  render() {
    const battletags = this.props.battletags.map((n, i) => (
      <List.Item key={i}>
        <List.Content>
          <Link to={`/battletag/${n.battletag.replace('#', '-')}`}>
            {n.battletag}
          </Link>
          <Button color="red" inverted onClick={() => {this.deleteNode(n)}}> Delete </Button>
        </List.Content>
      </List.Item>
      ));

    return (
      <List selection inverted animated size="large">
        {battletags}
      </List>
    );
  }
}
