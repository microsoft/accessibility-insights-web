// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { remote } from 'electron';
import * as ReactDOM from 'react-dom';
import { DeviceConnectViewRenderer } from './device-connect-view-renderer';

const dom = document;
const renderer = new DeviceConnectViewRenderer(ReactDOM.render, dom, remote.getCurrentWindow());
renderer.render();
