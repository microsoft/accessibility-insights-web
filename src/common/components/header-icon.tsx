// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BrandBlue } from '../../icons/brand/blue/brand-blue';
import { BrandWhite } from '../../icons/brand/white/brand-white';
import { NamedFC } from '../react/named-fc';
import { ThemeInnerState } from './theme';
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
    WithStoreSubscriptionProps,
} from './with-store-subscription';

export type HeaderIconState = ThemeInnerState;

export type HeaderIconDeps = WithStoreSubscriptionDeps<HeaderIconState>;

export type HeaderIconProps = {
    invertColors?: boolean;
} & WithStoreSubscriptionProps<HeaderIconState>;

export const HeaderIconComponent = NamedFC<HeaderIconProps>('HeaderIconComponent', props => {
    const state = props.storeState.userConfigurationStoreData;
    const enableHighContrast = state && state.enableHighContrast;

    const { invertColors = false } = props;

    const defaultIcon = invertColors ? <BrandBlue /> : <BrandWhite />;
    const highContrastIcon = invertColors ? <BrandWhite /> : <BrandBlue />;

    return enableHighContrast ? highContrastIcon : defaultIcon;
});

export const HeaderIcon =
    withStoreSubscription<HeaderIconProps, HeaderIconState>(HeaderIconComponent);
