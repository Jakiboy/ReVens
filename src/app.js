/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

'use strict';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Launcher from './app/launcher';

const root = document.getElementById('root');
createRoot(root).render(<Launcher />);
