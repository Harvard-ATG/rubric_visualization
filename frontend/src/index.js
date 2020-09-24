import React from 'react';
import { render } from 'react-dom';

import MVP from './components/MVP';

import { theme } from '@instructure/canvas-theme';
theme.use();

const container = document.getElementById('app');
render(<MVP />, container);
