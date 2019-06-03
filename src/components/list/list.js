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
      value: ''
    };
    // const state = window.localStorage.getItem('req_token');
    // if (state) {
    //   this.state.req_token = state;
    // }
    const test = JSON.parse(window.localStorage.getItem('saved_state'));
    if (test) {
      this.state = test;
    }
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
      value: ''
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
        console.log(body.toString());
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
      value: ''
    };
    window.localStorage.setItem('saved_state', JSON.stringify(state));
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
        console.log(body.toString());
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
    this.setState({ value: e.target.value });
    console.log(e.target.value);
  };

  handleSubmit = e => {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  };

  render() {
    const { authv4, req_token, access_token, account_id, value } = this.state;
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
          <form onSubmit={this.handleSubmit}>
            <label>
              Name of the new list:
              <input type="text" value={value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default hot(List);
