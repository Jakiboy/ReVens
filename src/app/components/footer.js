/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 2.0.0
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React from 'react';
import config from '../../config/app.json';

const Footer = () => (
  <div className="footer-wrapper">
    <p className="copyright">
      <a href={config.url}>
        <i className="icon-social-github"></i> {config.name}
      </a>
      <span className="space"></span> | {config.notice}
    </p>
    <p className="logger">
      <span className="status">[ ]</span>
    </p>
  </div>
);

export default Footer;
