/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect } from 'react';
import config from '../../config/app.json';

const Footer = () => {
  const [statusMessage, setStatusMessage] = useState('[ ]');
  const [statusColor, setStatusColor] = useState('');

  useEffect(() => {
    window.electron.onPackageStatus((status) => {
      setStatusMessage(status.message);
      setStatusColor(status.color);
    });
  }, []);

  return (
    <div className="footer-wrapper">
      <p className="copyright">
        <a href={config.url}>
          <i className="icon-social-github"></i> {config.name}
        </a>
        <span className="space"></span> | {config.notice.replace('{version}', config.version)}
      </p>
      <p className="logger">
        <span
          className={`status-dot${statusColor ? ' --' + statusColor : ''}`}
          title={statusMessage}
        ></span>
      </p>
    </div>
  );
};

export default Footer;
