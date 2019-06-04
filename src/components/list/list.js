import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import styles from './list.css';
import Autocomplete from '../autocomplete';
import ListModal from '../list-modal';
import Table from 'react-bootstrap/Table';
import { ButtonToolbar, Button } from 'react-bootstrap';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      api_key: '',
      authv4: '',
      req_token: '',
      account_id: '',
      access_token: '',
      new_name: '',
      new_description: '',
      lists: [],
      modalShow: false,
      selectedListId: ''
    };

    const savedState = JSON.parse(window.localStorage.getItem('saved_state'));
    if (savedState) {
      this.state = savedState;
      if (this.state.account_id != null && this.state.account_id.length > 0) {
        this.getLists();
      }
      var req_token = this.state.req_token;
      if (req_token != null && req_token.length > 0 && this.state.access_token == null) {
        this.getAccess(req_token);
      }
    }
  }

  onTextChangedApi4 = e => {
    const value = e.target.value;
    this.setState(() => ({
      authv4: value
    }));
  };

  onTextChangedApi3 = e => {
    const value = e.target.value;
    this.setState(() => ({
      api_key: value
    }));
  };

  requestAuthenticated(token, authv4, api_key) {
    this.setState(() => ({
      req_token: token
    }));
    const state = {
      req_token: token,
      authv4: authv4,
      api_key: api_key
    };
    window.localStorage.setItem('saved_state', JSON.stringify(state));
  }
  getRequestToken = () => {
    var authv4 = this.state.authv4;
    var api_key = this.state.api_key;
    var self = this;
    console.log(authv4);
    var http = require('https');

    var options = {
      method: 'POST',
      hostname: 'api.themoviedb.org',
      port: null,
      path: '/4/auth/request_token',
      headers: {
        authorization: `Bearer ${authv4}`,
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
        var data = JSON.parse(body);
        var token = data.request_token;
        self.requestAuthenticated(token, authv4, api_key);
        window.location = `https://www.themoviedb.org/auth/access?request_token=${token}`;
      });
    });

    req.write(JSON.stringify({ redirect_to: 'http://localhost:3000/' }));
    req.end();
  };

  setAccess(access_token, account_id) {
    const { authv4, api_key, req_token } = this.state;
    this.setState(() => ({
      access_token: access_token,
      account_id: account_id
    }));
    const state = {
      req_token: req_token,
      api_key: api_key,
      authv4: authv4,
      account_id: account_id,
      access_token: access_token
    };
    window.localStorage.setItem('saved_state', JSON.stringify(state));
    this.getLists();
  }

  getAccess(req_token) {
    var api_key = this.state.authv4;
    var self = this;
    var http = require('https');

    var options = {
      method: 'POST',
      hostname: 'api.themoviedb.org',
      port: null,
      path: '/4/auth/access_token',
      headers: {
        authorization: `Bearer ${api_key}`,
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
        var data = JSON.parse(body);
        var access_token = data.access_token;
        var account_id = data.account_id;
        self.setAccess(access_token, account_id);
      });
    });

    req.write(
      JSON.stringify({
        request_token: `${req_token}`
      })
    );
    req.end();
  }

  handleChange = e => {
    this.setState({ new_name: e.target.value });
    console.log(e.target.value);
  };

  handleDescription = e => {
    this.setState({ new_description: e.target.value });
  };
  resetInputValues() {
    const { authv4, req_token, account_id, access_token } = this.state;
    this.setState(() => ({
      new_name: '',
      new_description: ''
    }));
    const state = {
      req_token: req_token,
      authv4: authv4,
      account_id: account_id,
      access_token: access_token,
      new_name: '',
      new_description: ''
    };
    window.localStorage.setItem('saved_state', JSON.stringify(state));
  }
  handleSubmit = () => {
    var self = this;
    const { access_token, new_name, new_description } = this.state;
    var http = require('https');

    var options = {
      method: 'POST',
      hostname: 'api.themoviedb.org',
      port: null,
      path: '/4/list',
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
        console.log(body.toString());
        var data = JSON.parse(body);
        var success = data.success;
        if (success === false) {
          var message = data.error_message;
          if (message == null) {
            message = '';
          }
          alert('There has been an error while creating the list\n' + message);
        }
        self.resetInputValues();
        self.getLists();
      });
    });

    req.write(
      JSON.stringify({ name: `${new_name}`, iso_639_1: 'en', description: `${new_description}` })
    );
    req.end();
  };
  getLists() {
    var self = this;
    const { authv4, account_id } = this.state;
    var http = require('https');

    var options = {
      method: 'GET',
      hostname: 'api.themoviedb.org',
      port: null,
      path: `/4/account/${account_id}/lists?page=1`,
      headers: {
        authorization: `Bearer ${authv4}`
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
        var data = JSON.parse(body);
        self.setState(() => ({
          lists: data
        }));
      });
    });

    req.write('{}');
    req.end();
  }

  deleteList(id) {
    var self = this;
    var http = require('https');

    var options = {
      method: 'DELETE',
      hostname: 'api.themoviedb.org',
      port: null,
      path: `/4/list/${id}`,
      headers: {
        authorization: `Bearer ${this.state.access_token}`,
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
        console.log(body.toString());
        self.getLists();
      });
    });

    req.write(JSON.stringify({}));
    req.end();
  }

  suggestionSelected(listId) {
    this.setState(() => ({
      selectedListId: listId,
      modalShow: true
    }));
  }

  modalClose = () => {
    this.setState(() => ({
      modalShow: false
    }));
  };
  renderLists() {
    var self = this;
    var data = this.state.lists;
    //console.log(data);
    if (data == null || data.length == 0 || data.total_results === 0 || data.success === false) {
      return null;
    }
    var lists = data.results;
    return (
      <Table striped bordered hover size="sm">
        <tbody>
          {lists.map(list => (
            <tr key={list.id}>
              <td onClick={() => this.suggestionSelected(list.id)}>
                <h3>{list.name}</h3>
                <p>
                  {list.id} Description: {list.description}
                </p>
              </td>
              <td>
                <Autocomplete selectedId={list.id} />
              </td>
              <td className="align-middle">
                <button onClick={() => this.deleteList(list.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  render() {
    const {
      api_key,
      authv4,
      req_token,
      account_id,
      new_name,
      new_description,
      selectedListId
    } = this.state;
    var access = 'access denied';
    if (account_id != null && account_id.length != 0) {
      access = 'access granted';
    }
    return (
      <div>
        <div className="container">
          <h2> 1. Enter data -> press Approve </h2>
          <h2> 2. After authentication -> press Get access </h2>
          <div>
            <label htmlFor="comment">API Key (v3 auth):</label>
            <input
              className="form-control"
              id="comment"
              value={api_key}
              onChange={this.onTextChangedApi3}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="comment2">Enter API Read Access Token (v4 auth):</label>
            <textarea
              className="form-control"
              rows="3"
              id="comment2"
              value={authv4}
              onChange={this.onTextChangedApi4}
              type="text"
            />
          </div>
          <div>
            <button onClick={this.getRequestToken}>Approve</button>
          </div>
          {access}
        </div>
        <hr />
        <div className="container">
          <label>
            Name of the new list: <br />
            <input type="text" value={new_name} onChange={this.handleChange} />
          </label>
          <br />
          <label>
            Description: <br />
            <input type="text" value={new_description} onChange={this.handleDescription} />
          </label>
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
        <div className="container">{this.renderLists()}</div>
        <ListModal show={this.state.modalShow} onHide={this.modalClose} listId={selectedListId} />
      </div>
    );
  }
}

export default hot(List);
