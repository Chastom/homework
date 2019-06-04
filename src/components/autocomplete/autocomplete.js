import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import styles from './autocomplete.css';

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      text: '',
      movieId: '',
      disabledButton: true
    };
  }

  onTextChanged = e => {
    const value = e.target.value;
    this.setState(() => ({
      text: value,
      disabledButton: true
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
          <li
            onClick={() => this.suggestionSelected(movie.original_title, movie.id)}
            key={movie.id}
          >
            <h3>{movie.original_title}</h3>
            <p>
              {movie.vote_average} Rating, {movie.release_date.toString().slice(0, 4)}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  suggestionSelected(value, id) {
    this.setState(() => ({
      text: value,
      suggestions: [],
      movieId: id,
      disabledButton: false
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

  addMovie(listId) {
    const savedState = JSON.parse(window.localStorage.getItem('saved_state'));
    var access_token = savedState.access_token;
    //console.log(listId + ' ' + this.state.text + ' ' + this.state.movieId);
    var http = require('https');

    var options = {
      method: 'POST',
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
        console.log(body.toString());
      });
    });

    req.write(JSON.stringify({ items: [{ media_type: 'movie', media_id: this.state.movieId }] }));
    req.end();
  }

  render() {
    const { text, disabledButton } = this.state;
    return (
      <div>
        <div className={styles.InputBar}>
          <input
            value={text}
            onChange={this.onTextChanged}
            placeholder="Enter movie name"
            type="text"
          />
        </div>
        <div className={styles.AutoCompleteText}>{this.renderSuggestions()}</div>
        <button disabled={disabledButton} onClick={() => this.addMovie(this.props.selectedId)}>
          Add movie
        </button>
      </div>
    );
  }
}

export default hot(Autocomplete);
