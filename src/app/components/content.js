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

  const _section = generateSlug(activeSection.name);
  const _subs = activeSection.subs;
  const _packages = pConfig.packages;

  return (
    <div className="tab-content" id={`tab-content-${_section}`}>
        <div className="tab-pane fade show active" id={_section} role="tabpanel" aria-labelledby={`${_section}-tab`}>
            <p dangerouslySetInnerHTML={{ __html: activeSection.description }}></p>
            <div className="section-container app-scroller">
              {_subs.map((sub, index) => {
                const _sub = generateSlug(sub.title);
                return (
                  <div className="section-wrapper" key={index}>
                      <h3 className="section-title">{sub.title}</h3>
                      <p className="section-description" dangerouslySetInnerHTML={{ __html: sub.description }}></p>
                      <div className="button-wrapper">
                        {_packages.map((file, index) => {
                          const _fsection = generateSlug(file.section);
                          const _fsub = generateSlug(file.sub);
                          if ( (_fsection === _section) && (_fsub === _sub) ) {
                            return (
                              <Btn key={index}>
                                <i className={`icon-${file.icon}`}></i> {file.name}
                              </Btn>
                            );
                          }
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
    </div>
  );
};

export default Content;
