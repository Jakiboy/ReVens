/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';
import { MDBBtn as Btn } from 'mdb-react-ui-kit';
import { generateSlug } from '../helper';

const Section = ({ section, items }) => {

  const _section = generateSlug(section.name);
  const _subs = section.subs;

  return (
    <div className="tab-content" id={`tab-content-${_section}`}>
      <div className="tab-pane fade show active" id={_section} role="tabpanel" aria-labelledby={`${_section}-tab`}>
        <p dangerouslySetInnerHTML={{ __html: section.description }}></p>
        <div className="section-container app-scroller">
          {_subs.map((sub, index) => {
            const _sub = generateSlug(sub.title);
            return (
              <div className="section-wrapper" key={index}>
                <h3 className="section-title">{sub.title}</h3>
                <p className="section-description" dangerouslySetInnerHTML={{ __html: sub.description }}></p>
                <div className="button-wrapper">
                  {items.map((item, index) => {
                    const _isection = generateSlug(item.section);
                    const _isub = generateSlug(item.sub);
                    let name = item.name;
                    let icon;
                    switch (item.type) {
                      case 'zip':
                      case 'folder':
                        icon = 'folder';
                        break;
                      case 'doc':
                        icon = 'notebook';
                      case 'sound':
                        icon = 'music-tone';
                        break;
                      case 'cli':
                        icon = 'control-play';
                        name = `${name} (CLI)`;
                        break;
                      default:
                        icon = 'control-play';
                    }
                    if ((_isection === _section) && (_isub === _sub) && !item.extra) {
                      return (
                        <Btn className={`type-${item.type}`} key={index} onClick={() => window.electron.click(item.path)}>
                          <i className={`icon-${icon}`}></i> {name}
                        </Btn>
                      );
                    }
                  })}
                </div>
                {sub.extra && sub.extra.map((extra, index) => {
                  const _extra = generateSlug(extra);
                  return (
                    <div className="extra-wrapper" key={index}>
                      <p className="section-description">{extra}</p>
                      <div className="button-wrapper">
                        {items.map((item, index) => {
                          if (item.extra) {
                            const _isection = generateSlug(item.section);
                            const _isub = generateSlug(item.sub);
                            const _iextra = generateSlug(item.extra);
                            let name = item.name;
                            let icon;
                            switch (item.type) {
                              case 'zip':
                              case 'folder':
                                icon = 'folder';
                                break;
                              case 'doc':
                                icon = 'notebook';
                                break;
                              case 'sound':
                                icon = 'music-tone';
                                break;
                              case 'cli':
                                  icon = 'control-play';
                                  name = `${name} (CLI)`;
                                break;
                              default:
                                icon = 'control-play';
                            }
                            if ((_isection === _section) && (_isub === _sub) && (_iextra === _extra)) {
                              return (
                                <Btn className={`type-${item.type}`} key={index} onClick={() => window.electron.click(item.path)}>
                                  <i className={`icon-${icon}`}></i> {name}
                                </Btn>
                              );
                            }
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Section;
