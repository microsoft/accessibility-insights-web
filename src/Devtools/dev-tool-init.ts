// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'reflect-metadata';

import { DevToolInitializer } from './dev-tool-initializer';
import { container } from './dev-tool-ioc-config';

const devToolInitializer: DevToolInitializer = container.get(DevToolInitializer);
devToolInitializer.initialize();
