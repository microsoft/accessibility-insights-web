// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactDOM from 'react-dom';
import { AndroidConnectRender } from './android-connect-renderer';

const dom = document;
const renderer = new AndroidConnectRender(ReactDOM.render, dom);
renderer.render();
