/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useMemo } from 'react';
import { MDBBtn as Btn } from 'mdb-react-ui-kit';
import { generateSlug } from '../helper';

// Helper function to get icon based on item type
const getItemIcon = (type) => {
  switch (type) {
    case 'zip':
    case 'folder':
      return 'folder';
    case 'doc':
    case 'pdf':
    case 'md':
      return 'notebook';
    case 'sound':
    case 'mx':
    case 'mp3':
      return 'music-tone';
    case 'exe':
    case 'cli':
    case 'sh':
    case 'ps1':
      return 'control-play';
    default:
      return 'flag';
  }
};

// Helper function to format item name
const formatItemName = (name, type) => {
  const truncatedName = name.length > 23 ? name.substring(0, 23) : name;
  return type === 'cli' ? `${truncatedName} (CLI)` : truncatedName;
};

// ItemButton component to reduce duplication
const ItemButton = ({ item, isDisabled }) => {
  const icon = getItemIcon(item.type);
  const name = formatItemName(item.name, item.type);

  return (
    <Btn
      className={`type-${item.type}`}
      onClick={() => window.electron.click(item.path)}
      title={item.desc || ''}
      disabled={isDisabled(item.path)}
      data-path={item.path}
    >
      <i className={`icon-${icon}`}></i> {name}
    </Btn>
  );
};

const Section = ({ section, items, disabledPaths = [] }) => {

  const _section = generateSlug(section.name);
  const _subs = section.sub;

  // Convert array to Set for O(1) lookup performance
  const disabledSet = useMemo(() => new Set(disabledPaths), [disabledPaths]);
  const isDisabled = (path) => disabledSet.has(path);

  return (
    <div className="tab-content" id={`tab-content-${_section}`}>
      <div className="tab-pane fade show active" id={_section} role="tabpanel" aria-labelledby={`${_section}-tab`}>
        <p dangerouslySetInnerHTML={{ __html: section.desc }}></p>
        <div className="section-container app-scroller">
          {_subs.map((sub, index) => {
            const _sub = generateSlug(sub.title);
            return (
              <div className="section-wrapper" key={index}>
                <h3 className="section-title">{sub.title}</h3>
                <p className="section-description" dangerouslySetInnerHTML={{ __html: sub.desc }}></p>
                <div className="button-wrapper">
                  {items.map((item, itemIndex) => {
                    const _isection = generateSlug(item.section);
                    const _isub = generateSlug(item.sub);

                    if ((_isection === _section) && (_isub === _sub) && !item.extra) {
                      return <ItemButton key={itemIndex} item={item} isDisabled={isDisabled} />;
                    }
                    return null;
                  })}
                </div>
                {sub.extra && sub.extra.map((extra, extraIndex) => {
                  const _extra = generateSlug(extra);
                  return (
                    <div className="extra-wrapper" key={extraIndex}>
                      <p className="section-description">{extra}</p>
                      <div className="button-wrapper">
                        {items.map((item, itemIndex) => {
                          if (!item.extra) return null;

                          const _isection = generateSlug(item.section);
                          const _isub = generateSlug(item.sub);
                          const _iextra = generateSlug(item.extra);

                          if ((_isection === _section) && (_isub === _sub) && (_iextra === _extra)) {
                            return <ItemButton key={itemIndex} item={item} isDisabled={isDisabled} />;
                          }
                          return null;
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
