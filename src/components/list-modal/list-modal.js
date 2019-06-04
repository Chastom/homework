import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class Example extends React.Component {
  // constructor(props, context) {
  //   super(props, context);

  //   this.handleShow = this.handleShow.bind(this);
  //   this.handleClose = this.handleClose.bind(this);

  //   this.state = {
  //     show: false
  //   };
  // }

  // handleClose() {
  //   this.setState({ show: false });
  // }

  // handleShow() {
  //   this.setState({ show: true });
  // }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <a>ID: {this.props.listId}</a>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default hot(Example);
