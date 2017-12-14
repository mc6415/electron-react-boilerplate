/* eslint-disable promise/always-return,promise/catch-or-return */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Loader, Header, Image } from 'semantic-ui-react';

export default class TagPage extends Component {
  constructor(props) {
    super(props);
    this.state = { battletag: this.props.match.params.id, regions: [], dataLoaded: false };
  }

  componentWillMount = () => {
    fetch(`https://owapi.net/api/v3/u/${this.state.battletag}/stats`)
      .then(res => res.json())
      .then((out) => {
        const data = [];
        data.push(out);
        this.setState({ regions: data, dataLoaded: true });
        console.log(out);
      });
  }

  render() {
    if (!this.state.dataLoaded) {
      return (
        <Loader active inline="centered" inverted size="massive" />
      );
    }

    return (
      <div>
        <Link to="/profile">
          <Icon name="user" size="large" />
        </Link>
        <Header as="h1">
          <Image src={this.state.regions[0].eu.stats.competitive.overall_stats.tier_image} />
          {this.state.battletag}
        </Header>
      </div>
    );
  }
}
