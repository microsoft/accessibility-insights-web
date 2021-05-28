// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DEFAULT_ELECTRON_TEST_TIMEOUT_MS } from './timeouts';

jest.setTimeout(DEFAULT_ELECTRON_TEST_TIMEOUT_MS);
jest.retryTimes(3);
