import { hot } from 'react-hot-loader/root';

import React from 'react';

import Autocomplete from '../autocomplete';
import List from '../list';

import styles from './app.css';

const App = () => (
  <div>
    <List />
  </div>
);

export default hot(App);
