import { hot } from 'react-hot-loader/root';

import React from 'react';

import Autocomplete from '../autocomplete';
import List from '../list';

import styles from './app.css';

const App = () => (
  <div>
    <List />
    <div>
      <div className="text-center">
        <footer className="page-footer font-small blue pt-4 ">
          <img src="https://www.themoviedb.org/assets/2/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png" />
        </footer>
      </div>
    </div>
  </div>
);

export default hot(App);
