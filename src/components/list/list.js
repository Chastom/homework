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
      access_token: ''
    };
    const state = window.localStorage.getItem('req_token');
    if (state) {
      this.state.req_token = state;
    }
  }

  onTextChanged = e => {
    const value = e.target.value;
    this.setState(() => ({
      authv4: value
    }));
  };

  requestAuthenticated(token) {
    this.setState(() => ({
      req_token: token
    }));
    window.localStorage.setItem('req_token', token);
  }
  getRequestToken = () => {
    var api_key = this.state.authv4;
    console.log(api_key);
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
        self.requestAuthenticated(token);
        window.location = `https://www.themoviedb.org/auth/access?request_token=${token}`;
      });
    });

    req.write(JSON.stringify({ redirect_to: 'http://localhost:3000/' }));
    req.end();
  };

  setAccess(access_token, account_id) {
    this.setState(() => ({
      access_token: access_token,
      account_id: account_id
    }));
  }

  getAccess(req_token) {
    var self = this;
    var http = require('https');

    var options = {
      method: 'POST',
      hostname: 'api.themoviedb.org',
      port: null,
      path: '/4/auth/access_token',
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTY4ZDkyN2FlODRmYmMwNGRhMjJjYWEzOWUyYmJiZCIsInN1YiI6IjVjZWZkMzlhMGUwYTI2NmE0ZGNhOGVlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.raoO_qEH7gvKBKr0gmiKCL5fGrd7oytNMkKbQi288-o',
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

  render() {
    const { authv4, req_token, access_token, account_id } = this.state;
    //console.log(authv4);
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
        <button onClick={this.getRequestToken}>Approve</button>
        {req_token}
        <button onClick={() => this.getAccess(req_token)}>Get access</button>
        {account_id}
      </div>
    );
  }
}

export default hot(List);
