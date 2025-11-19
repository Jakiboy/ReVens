/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../../config/app.json';
import 'mdb-react-ui-kit/dist/css/mdb.dark.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import '../assets/css/app.css';

const Head = () => (
  <Helmet>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>{config.name} - {config.desc || config.desc}</title>
  </Helmet>
);

export default Head;
