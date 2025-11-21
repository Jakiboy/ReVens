/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect, useMemo } from 'react';
import Head from './components/head';
import Header from './components/header';
import Tabs from './components/tabs';
import Content from './components/content';
import Footer from './components/footer';
import About from './components/about';
import Notice from './components/notice';
import Settings from './components/settings';
import Search from './components/search';
import Download from './components/download';
import iConfig from '../config/items.json';

const Launcher = () => {
  const initialTab = localStorage.getItem('activeTab') || 'analyzing';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [disabledSlugs, setDisabledSlugs] = useState([]);

  // Memoize all slugs for empty status fallback
  const allSlugs = useMemo(
    () => iConfig.items.map(item => item.slug).filter(Boolean),
    []
  );

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handlePackageStatus = (status) => {
      if (status.disabledPaths && Array.isArray(status.disabledPaths)) {
        setDisabledSlugs(status.disabledPaths);
      } else if (status.status === 'empty') {
        setDisabledSlugs(allSlugs);
      } else {
        setDisabledSlugs([]);
      }
    };

    const handleSwitchToAI = () => {
      setActiveTab('ai');
    };

    window.electron.onPackageStatus(handlePackageStatus);
    window.electron.on('switch-to-ai', handleSwitchToAI);
  }, [allSlugs]);

  return (
    <>
      <Head />
      <div className="container">
        <Header />
        <div className="content-wrapper">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Content activeTab={activeTab} disabledSlugs={disabledSlugs} />
        </div>
        <hr className="separator my-3" />
        <Footer />
        <About />
        <Notice />
        <Settings />
        <Search setActiveTab={setActiveTab} />
        <Download />
      </div>
    </>
  );
};

export default Launcher;
