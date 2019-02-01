// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../react/named-sfc';
import { UserConfigurationStoreData } from '../types/store-data/user-configuration-store';
import { withStoreSubscription, WithStoreSubscriptionProps } from './with-store-subscription';

// tslint:disable-next-line:no-require-imports
import BodyClassName = require('react-body-classname');

export interface ThemeSwitcherState {
    userConfigurationStoreData: UserConfigurationStoreData;
}

export type ThemeSwitcherProps = WithStoreSubscriptionProps<ThemeSwitcherState>;

export const ControlledBodyClassName = NamedSFC<ThemeSwitcherProps>('ThemeSwitcher', props => {
    const state = props.storeState.userConfigurationStoreData;
    const className = `theme-switcher${state && state.enableHighContrast ? ' high-contrast-theme' : ''}`;
    return <BodyClassName className={className} />;
});

export const Theme = withStoreSubscription<ThemeSwitcherProps, ThemeSwitcherState>(ControlledBodyClassName);
