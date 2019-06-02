import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import styles from './list.css';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      text: '',
      req_token: ''
    };
    const state = window.localStorage.getItem('req_token');
    console.log(state);
    if (state) {
      this.state.req_token = state;
    }
  }

  onTextChanged = e => {
    const value = e.target.value;
    this.setState(() => ({
      text: value
    }));
    this.getMovies(value);
  };

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    var movies = suggestions.slice(0, 8);
    return (
      <ul>
        {movies.map(movie => (
          <li onClick={() => this.suggestionSelected(movie.original_title)} key={movie.id}>
            <h3>{movie.original_title}</h3>
            <p>
              {movie.vote_average} Rating, {movie.release_date.toString().slice(0, 4)}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  suggestionSelected(value) {
    this.setState(() => ({
      text: value,
      suggestions: []
    }));
  }

  getMovies(text) {
    if (text.length > 2) {
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&language=en-US&query=${text}&page=1&include_adult=false`
      )
        .then(res => res.json())
        .then(res =>
          this.setState(() => ({
            suggestions: res.results
          }))
        );
    } else {
      this.setState(() => ({
        suggestions: []
      }));
    }
  }

  requestAuthenticated(token) {
    this.setState(() => ({
      req_token: token
    }));
    window.localStorage.setItem('req_token', token);
  }
  getRequestToken = () => {
    var self = this;
    console.log('Button clicked');
    var http = require('https');

    var options = {
      method: 'POST',
      hostname: 'api.themoviedb.org',
      port: null,
      path: '/4/auth/request_token',
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
        var token = data.request_token;
        self.requestAuthenticated(token);
        window.location = `https://www.themoviedb.org/auth/access?request_token=${token}`;
      });
    });

    req.write(JSON.stringify({ redirect_to: 'http://localhost:3000/' }));
    req.end();
  };

  render() {
    const { text, req_token } = this.state;
    return (
      <div>
        <div className={styles.InputBar}>
          <input
            value={text}
            onChange={this.onTextChanged}
            placeholder="Enter API Read Access Token"
            type="text"
          />
        </div>
        <div className={styles.AutoCompleteText}>{this.renderSuggestions()}</div>
        <button onClick={this.getRequestToken}>Click me</button>
        {req_token}
      </div>
    );
  }
}

export default hot(List);
