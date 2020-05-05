// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Switcher, SwitcherProps } from 'DetailsView/components/switcher';
import * as React from 'react';
import * as headerSwitcherStyles from './switcher.scss';

export function getHeaderSwitcher(props: Omit<SwitcherProps, 'styles'>): JSX.Element {
    return <Switcher styles={{ ...headerSwitcherStyles }} {...props} />;
}
