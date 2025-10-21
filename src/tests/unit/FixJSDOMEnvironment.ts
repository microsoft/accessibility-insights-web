// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
 
// Custom JSDOM environment that provides structuredClone to the test environment
// This is required for fake-indexeddb v5+ which needs structuredClone to be globally available
// See: https://github.com/dumbmatter/fakeIndexedDB/issues/88
 
import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import JSDOMEnvironment from 'jest-environment-jsdom';
 
export default class FixJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context);
 
        // Node.js 17+ has structuredClone as a global
        // We inject it into the JSDOM environment so it's available to tests
        if (typeof structuredClone === 'function') {
            this.global.structuredClone = structuredClone;
        }
    }
}