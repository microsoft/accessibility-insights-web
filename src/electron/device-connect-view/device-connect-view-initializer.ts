// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactDOM from 'react-dom';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

const dom = document;
const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom);
renderer.render();
