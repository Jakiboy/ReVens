/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';
import config from './../../config/sections.json';
import { generateSlug } from '../helper';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <ul className="nav nav-tabs mb-3" id="revens-tab" role="tablist">
      {config.sections.map((section, index) => {
        const slug = generateSlug(section.name);
        return (
          <li className="nav-item" role="presentation" key={index}>
            <button
              className={`nav-link ${activeTab === slug ? 'active' : ''}`}
              id={`${slug}-tab`}
              type="button"
              role="tab"
              aria-controls={slug}
              aria-selected={activeTab === slug}
              onClick={() => setActiveTab(slug)}
            >
              <i className={`icon-${section.icon}`}></i> <span className="tab-title">{section.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Tabs;
