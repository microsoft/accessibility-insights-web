// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactDOM from 'react-dom';
import { AndroidConnectRenderer } from './android-connect-renderer';

const dom = document;
const renderer = new AndroidConnectRenderer(ReactDOM.render, dom);
renderer.render();
