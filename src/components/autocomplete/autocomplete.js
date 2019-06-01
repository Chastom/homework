import { hot } from 'react-hot-loader/root';
import React, {Component} from 'react';
import styles from './autocomplete.css';

class Autocomplete extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        suggestions: [],
        text: '',
    };
  }  

  onTextChanged = (e) => {
      const value = e.target.value;      
      this.setState(() => ({
        text: value,
      }));
      this.getMovies(value);
  }

  renderSuggestions() {
    const {suggestions} = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    var movies = suggestions.slice(0,8);
    return (
        <ul>
          {movies.map((movie) => 
          <li onClick={() => this.suggestionSelected(movie.original_title)} key={movie.id}>
            <h3>{movie.original_title}</h3>
            <p>{movie.vote_average} Rating, {movie.release_date.toString().slice(0,4)}</p>
          </li>
          )}
        </ul>
      );    
  }

  suggestionSelected (value) {
    this.setState(() =>  ({
        text: value,
        suggestions: [],
    }))
  }

  getMovies (text) {
    if(text.length > 2) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&language=en-US&query=${text}&page=1&include_adult=false`)
      .then(res => res.json())
      .then(res => this.setState(() => ({
        suggestions: res.results ,      
      })));
    }else{
      this.setState(() => ({
        suggestions: [],
      }));
    }
  }

  render () {
    const {text} = this.state;
    return (
      <div>
        <div className={styles.InputBar}>
          <img src='https://i.imgur.com/QOnoqEX.png'/>  
          <input value={text} onChange={this.onTextChanged} placeholder="Enter movie name" type="text" />           
          <img className={styles.right} src='https://i.imgur.com/tcRNFtE.png'/>
        </div>
        <div className={styles.AutoCompleteText}>
          {this.renderSuggestions()}
        </div>
      </div>
    )
  }
}

export default hot(Autocomplete);