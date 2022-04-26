// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as util from 'util';
import { setIconOptions } from '@fluentui/react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
setIconOptions({
    disableWarnings: true,
});

// This is a workaround for https://github.com/jsdom/jsdom/issues/2524#issuecomment-902027138
//
// We have a few tests that intentionally load a fresh JSDOM context (to test in an isolated
// document) from within a JSDOM-based environment (because several of our dependencies expect
// global window APIs to be available).
window.TextEncoder = util.TextEncoder as unknown as typeof window.TextEncoder;
window.TextDecoder = util.TextDecoder as unknown as typeof window.TextDecoder;
