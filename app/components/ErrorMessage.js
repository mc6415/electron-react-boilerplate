import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

export default class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  };
  render() {
    return (
      <div style={{ marginBottom: '15px' }}>
        <Message negative>
          <Message.Header>Something Went Wrong!</Message.Header>
          {this.props.message}
        </Message>
      </div>
    );
  }
}

