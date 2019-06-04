import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

import express from 'express';

import App from '../components/app';

const app = express();

app.use(express.static('dist'));

app.get('/', (req, res) => {
  // then use `assetsByChunkName` for server-sider rendering
  // For example, if you have only one main chunk:
  res.send(`
  <html>
    <head>
      <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
      />
      <title>Kayak UI Academy</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div id="root">${renderToStaticMarkup(<App />)}</div>
      <script src="/index.js"></script>
    </body>
  </html>
    `);
});

app.listen(3000, () => console.log('Production server is running on!'));
