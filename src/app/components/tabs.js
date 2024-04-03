/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <ul className="nav nav-tabs mb-3" id="myTab0" role="tablist">
      <li className="nav-item" role="presentation">
        <button
          className={`nav-link ${activeTab === 'section-1' ? 'active' : ''}`}
          id="section-1-tab"
          type="button"
          role="tab"
          aria-controls="section-1"
          aria-selected={activeTab === 'section-1'}
          onClick={() => setActiveTab('section-1')}
        >
          <i className="icon-magnifier"></i> <span className="tab-title">Section 1</span>
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className={`nav-link ${activeTab === 'section-2' ? 'active' : ''}`}
          id="section-2-tab"
          type="button"
          role="tab"
          aria-controls="section-2"
          aria-selected={activeTab === 'section-2'}
          onClick={() => setActiveTab('section-2')}
        >
          <i className="icon-puzzle"></i> <span className="tab-title">Section 2</span>
        </button>
      </li>
    </ul>
  );
};

export default Tabs;
