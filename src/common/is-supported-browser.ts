// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import UAParser from 'ua-parser-js';

export type IsSupportedBrowser = () => boolean;

export const createSupportedBrowserChecker = (uaParser: UAParser): IsSupportedBrowser => {
    return () => {
        return !(uaParser.getBrowser().name === 'Edge' && uaParser.getEngine().name === 'EdgeHTML');
    };
};
