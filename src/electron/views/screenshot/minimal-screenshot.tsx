// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Screenshot } from 'electron/views/screenshot/screenshot';
import * as React from 'react';
import { minimalScreenshot } from './Teams-screenshot';

export const MinimalScreenshotComponent = NamedFC('MinimalScreenshotComponent', () => {
    return <Screenshot encodedImage={minimalScreenshot} altText="axe android results screenshot" />;
});
