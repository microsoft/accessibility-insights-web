import { WithStoreSubscriptionDeps, withStoreSubscription } from './with-store-subscription';
import { ThemeInnerState } from './theme';
import { NamedSFC } from '../react/named-sfc';
import * as React from 'react';

export type HeaderIconDeps = WithStoreSubscriptionDeps<HeaderIconState>;

export type HeaderIconProps = {
    deps: HeaderIconDeps;
    storeState?: HeaderIconState;
};

export type HeaderIconState = ThemeInnerState;

export const HeaderIconComponent = NamedSFC<HeaderIconProps>('HeaderIconComponent', (props: HeaderIconProps) => {
    const WHITE_ICON = '../../icons/brand/white/brand-white-48px.png';
    const BLUE_ICON = '../../icons/brand/blue/brand-blue-48px.png';
    const state = props.storeState.userConfigurationStoreData;
    const enableHighContrast = state && state.enableHighContrast;
    const iconPath = enableHighContrast ? BLUE_ICON : WHITE_ICON;
    return <img className="header-icon" src={iconPath} alt="" />;
});

export const HeaderIcon = withStoreSubscription<HeaderIconProps, HeaderIconState>(HeaderIconComponent);
