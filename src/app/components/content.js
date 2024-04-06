/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';
import strings from './../../config/strings.json';
import sConfig from './../../config/sections.json';
import iConfig from './../../config/items.json';
import Section from './section';
import { generateSlug } from '../helper';

const Content = ({ activeTab }) => {

  const activeSection = sConfig.sections.find(
    section => generateSlug(section.name) === activeTab
  );

  if (!activeSection) {
    return (
      <div className="tab-content has-error">
        <p>
          <strong><i className="icon-exclamation"></i> {strings.error.title}</strong>:
          <span className="space"></span> {strings.error.section}
        </p>
      </div>
    );
  }

  return <Section section={activeSection} items={iConfig.items} />;
};

export default Content;
