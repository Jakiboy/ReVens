/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';
import { MDBBtn as Btn } from 'mdb-react-ui-kit';
import { generateSlug } from '../helper';
import strings from './../../config/strings.json';
import sConfig from './../../config/sections.json';
import pConfig from './../../config/packages.json';

const Content = ({ activeTab }) => {

  const activeSection = sConfig.sections.find(
    section => generateSlug(section.name) === activeTab
  );

  if ( !activeSection ) {
    return (
      <div className="tab-content has-error">
        <p>
          <strong><i className="icon-exclamation"></i> {strings.error.title}</strong>:
          <span className="space"></span> {strings.error.section}
        </p>
      </div>
    );
  }

  return (
    <div className="tab-content" id={`tab-content-${generateSlug(activeSection.name)}`}>
      <div className="tab-pane fade show active" id={generateSlug(activeSection.name)} role="tabpanel" aria-labelledby={`${generateSlug(activeSection.name)}-tab`}>
        <p dangerouslySetInnerHTML={{ __html: activeSection.description }}></p>
        <div className="section-container app-scroller">
          {activeSection.subs.map((sub, index) => (
            <div className="section-wrapper" key={index}>
              <h3 className="section-title">{sub.title}</h3>
              <p className="section-description" dangerouslySetInnerHTML={{ __html: sub.description }}></p>
              <div className="button-wrapper">
                {pConfig.packages.filter(pkg => pkg.section === activeSection.name && pkg.sub === sub.title).map((software, index) => (
                  <Btn key={index}>
                    <i className={`icon-${software.icon}`}></i> {software.name}
                  </Btn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
