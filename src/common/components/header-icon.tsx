// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BrandBlue } from '../../icons/brand/blue/brand-blue';
import { BrandWhite } from '../../icons/brand/white/brand-white';
import { NamedFC } from '../react/named-fc';
import { ThemeInnerState } from './theme';
import { withStoreSubscription, WithStoreSubscriptionDeps, WithStoreSubscriptionProps } from './with-store-subscription';

export type HeaderIconDeps = WithStoreSubscriptionDeps<HeaderIconState>;

export type HeaderIconProps = WithStoreSubscriptionProps<HeaderIconState>;

export type HeaderIconState = ThemeInnerState;

export const HeaderIconComponent = NamedFC<HeaderIconProps>('HeaderIconComponent', (props: HeaderIconProps) => {
    const state = props.storeState.userConfigurationStoreData;
    const enableHighContrast = state && state.enableHighContrast;

    return enableHighContrast ? <BrandBlue /> : <BrandWhite />;
});

export const HeaderIcon = withStoreSubscription<HeaderIconProps, HeaderIconState>(HeaderIconComponent);
