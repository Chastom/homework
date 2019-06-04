import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      movies: [],
      currentId: ''
    };
  }

  getMovies = () => {
    var self = this;
    const savedState = JSON.parse(window.localStorage.getItem('saved_state'));

    if (savedState) {
      var access_token = savedState.access_token;
      var api_key = savedState.api_key;
      if (this.props.listId == null) return;

      if (this.props.listId.length == 0) {
        self.setState(() => ({
          currentId: ''
        }));
        return;
      }

      var listId = parseInt(this.props.listId);

      var http = require('https');

      var options = {
        method: 'GET',
        hostname: 'api.themoviedb.org',
        port: null,
        path: `/4/list/${listId}?api_key=${api_key}&page=1`,
        headers: {
          'content-type': 'application/json;charset=utf-8',
          authorization: `Bearer ${access_token}`
        }
      };

      var req = http.request(options, function(res) {
        var chunks = [];

        res.on('data', function(chunk) {
          chunks.push(chunk);
        });

        res.on('end', function() {
          var body = Buffer.concat(chunks);
          var data = JSON.parse(body);
          //console.log(data.results);
          self.setState(() => ({
            movies: data.results,
            currentId: self.props.listId
          }));
        });
      });

      req.write(JSON.stringify({}));
      req.end();
    }
  };

  deleteMovie(id) {
    var self = this;
    const savedState = JSON.parse(window.localStorage.getItem('saved_state'));
    var access_token = savedState.access_token;
    var listId = parseInt(this.props.listId);
    var http = require('https');

    var options = {
      method: 'DELETE',
      hostname: 'api.themoviedb.org',
      port: null,
      path: `/4/list/${listId}/items`,
      headers: {
        authorization: `Bearer ${access_token}`,
        'content-type': 'application/json;charset=utf-8'
      }
    };

    var req = http.request(options, function(res) {
      var chunks = [];

      res.on('data', function(chunk) {
        chunks.push(chunk);
      });

      res.on('end', function() {
        var body = Buffer.concat(chunks);
        //console.log(body.toString());
        self.getMovies();
      });
    });

    req.write(JSON.stringify({ items: [{ media_type: 'movie', media_id: id }] }));
    req.end();
  }

  renderMovies() {
    var movies = this.state.movies;
    if (movies == null || movies.length === 0) {
      return null;
    }
    return (
      <Table bordered hover size="sm">
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>
                <h5>{movie.original_title}</h5>
                <p>
                  {movie.vote_average} Rating, {movie.release_date.toString().slice(0, 4)}
                </p>
              </td>
              <td className="align-middle">
                <button onClick={() => this.deleteMovie(movie.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  render() {
    if (this.props.listId != this.state.currentId) {
      this.getMovies();
    }
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Your movies</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.renderMovies()}</Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default hot(Example);
