/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../../config/app.json';
import '../assets/vendor/mdb/mdb.dark.min.css';
import '../assets/vendor/simple-line-icons/simple-line-icons.min.css';
import '../assets/css/font.css';
import '../assets/css/app.css';

const Head = () => (
  <Helmet>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>{config.name} - {config.desctiption}</title>
  </Helmet>
);

export default Head;
