const server = require('./api/server.js');

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});



/*

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {BrowserRouter as Router} from 'react-router-dom'

ReactDOM.render(<Router>
        <App /></Router>, document.getElementById("root"));

*/