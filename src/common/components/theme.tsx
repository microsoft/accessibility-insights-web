// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';
// tslint:disable-next-line:no-require-imports
import BodyClassName = require('react-body-classname');

import { NamedSFC } from '../react/named-sfc';
import { UserConfigurationStoreData } from '../types/store-data/user-configuration-store';
import { withStoreSubscription, WithStoreSubscriptionProps } from './with-store-subscription';

export interface ThemeInnerState {
    userConfigurationStoreData: UserConfigurationStoreData;
}

export type ThemeInnerProps = WithStoreSubscriptionProps<ThemeInnerState>;

export const ThemeInner = NamedSFC<ThemeInnerProps>('ThemeInner', props => {
    const state = props.storeState.userConfigurationStoreData;
    const className = css('theme-switcher', state && state.enableHighContrast && 'high-contrast-theme');

    return <BodyClassName className={className} />;
});

export const Theme = withStoreSubscription<ThemeInnerProps, ThemeInnerState>(ThemeInner);
