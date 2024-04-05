/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React, { useState } from 'react';
import Head from './components/head';
import Header from './components/header';
import Tabs from './components/tabs';
import Content from './components/content';
import Footer from './components/footer';

const Launcher = () => {

  const [activeTab, setActiveTab] = useState('analyzing');

  return (
    <>
      <Head />
      <div className="container">
        <Header />
        <div className="content-wrapper">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Content activeTab={activeTab} />
        </div>
        <hr className="separator my-3" />
        <Footer />
      </div>
    </>
  );
};

export default Launcher;
