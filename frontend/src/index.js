import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

import { theme } from '@instructure/canvas-theme';
theme.use();

const container = document.getElementById('app');
render(<App />, container);
