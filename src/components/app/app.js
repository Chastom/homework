import { hot } from 'react-hot-loader/root';

import React from 'react';

import Autocomplete from '../autocomplete';
import List from '../list';

import styles from './app.css';

const App = () => (
  <div>          
      <div className={styles.container}>
        <div className={styles.size}>
          <Autocomplete />    
        </div>            
      </div>
          
    <List />    


  </div>


);

export default hot(App);
