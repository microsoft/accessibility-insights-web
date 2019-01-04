// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapter } from '../background/dev-tools-chrome-adapter';
import { DevToolInitializer } from './dev-tool-initializer';

const browserAdapter = new DevToolsChromeAdapter();
const devToolInitializer: DevToolInitializer = new DevToolInitializer(browserAdapter);
devToolInitializer.initialize();
