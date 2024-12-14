/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.1
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

'use strict';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Launcher from './app/launcher';

const root = document.getElementById('root');
createRoot(root).render(<Launcher />);
