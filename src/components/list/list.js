import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import styles from './list.css';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authv4: '',
      req_token: '',
      account_id: '',
      access_token: '',
      new_name: '',
      new_description: '',
      lists: []
    };

    const test = JSON.parse(window.localStorage.getItem('saved_state'));
    if (test) {
      this.state = test;
    }
    this.getLists();
  }

  onTextChanged = e => {
    const value = e.target.value;
    this.setState(() => ({
      authv4: value
    }));
  };

  requestAuthenticated(token, api_key) {
    this.setState(() => ({
      req_token: token
    }));
    const state = {
      req_token: token,
      authv4: api_key,
      new_name: '',
      new_description: ''
    };
    window.localStorage.setItem('saved_state', JSON.stringify(state));
  }
  getRequestToken = () => {
    var api_key = this.state.authv4;
    var self = this;
    console.log('Button clicked');
    var http = require('https');

    var options = {
      method: 'POST',
      hostname: 'api.themoviedb.org',
      port: null,
      path: '/4/auth/request_token',
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
        var token = data.request_token;
        self.requestAuthenticated(token, api_key);
        window.location = `https://www.themoviedb.org/auth/access?request_token=${token}`;
      });
    });

    req.write(JSON.stringify({ redirect_to: 'http://localhost:3000/' }));
    req.end();
  };

  setAccess(access_token, account_id) {
    const { authv4, req_token } = this.state;
    this.setState(() => ({
      access_token: access_token,
      account_id: account_id
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
  handleSubmit = e => {
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
  suggestionSelected(name) {
    console.log('li called func');
  }
  renderLists() {
    var data = this.state.lists;
    //console.log(data);
    if (data == null || data.total_results === 0 || data.success === false) {
      return null;
    }
    var lists = data.results;
    return (
      <table>
        <tbody>
          {lists.map(list => (
            <tr key={list.id}>
              <td onClick={() => this.suggestionSelected(list.name)}>
                <h3>{list.name}</h3>
                <p>
                  {list.id} Description: {list.description}
                </p>
              </td>
              <td>
                <button onClick={() => this.deleteList(list.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  render() {
    const { authv4, req_token, access_token, account_id, new_name, new_description } = this.state;
    return (
      <div>
        <div className={styles.InputBar}>
          <input
            value={authv4}
            onChange={this.onTextChanged}
            placeholder="Enter API Read Access Token"
            type="text"
          />
        </div>
        <div>
          <button onClick={this.getRequestToken}>Approve</button>
          {req_token}
        </div>
        <div>
          <button onClick={() => this.getAccess(req_token)}>Get access</button>
          {account_id}
        </div>
        <div>
          <label>
            Name of the new list:
            <input type="text" value={new_name} onChange={this.handleChange} />
          </label>
          <label>
            Description:
            <input type="text" value={new_description} onChange={this.handleDescription} />
          </label>
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
        <div className={styles.AutoCompleteText}>{this.renderLists()}</div>
      </div>
    );
  }
}

export default hot(List);
