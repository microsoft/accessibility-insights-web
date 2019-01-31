// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
// tslint:disable-next-line:no-require-imports
import BodyClassName = require('react-body-classname');

import { UserConfigurationStoreData } from '../types/store-data/user-configuration-store';
import { IBaseStore } from '../istore';

export interface ThemeState {
    isHighContrastEnabled: boolean;
}

export function withThemedBody<P>(Component: React.ComponentType<P>, getTheme: (props: P) => boolean): (props: P) => JSX.Element {
    return (props: P) => {
        const isHighContrastEnabled = getTheme(props);
        const className = `theme-switcher${isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
        return (
            <BodyClassName className={className}>
                <Component {...props} />
            </BodyClassName>
        );
    };
}

export function withThemedBody2<P>(
    Component: React.ComponentType<P>,
    userConfigStore: IBaseStore<UserConfigurationStoreData>): (props: P) => JSX.Element {
    return (props: P) => {
        const storeState = userConfigStore.getState();
        const isHighContrastEnabled = storeState && storeState.enableTelemetry;
        const className = `theme-switcher${isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
        return (
            <BodyClassName className={className}>
                <Component {...props} />
            </BodyClassName>
        );
    };
}

export function withThemedBody3(
    Component: React.ComponentType,
    userConfigStore: IBaseStore<UserConfigurationStoreData>) {

    return class extends React.Component<any, ThemeState> {
        constructor(props: any) {
            super(props);
            const storeState = userConfigStore.getState();
            this.state = { isHighContrastEnabled: storeState && storeState.enableTelemetry };
        }

        public componentDidMount(): void {
            userConfigStore.getState();
            userConfigStore.addChangedListener(this.updateState);
        }

        public componentWillUnmount(): void {
            userConfigStore.removeChangedListener(this.updateState);
        }

        public updateState = () => {
            const storeState = userConfigStore.getState();
            this.setState({ isHighContrastEnabled: storeState && storeState.enableTelemetry });
        }

        public render(): JSX.Element {
            const className = `theme-switcher${this.state.isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
            return (
                <BodyClassName className={className}>
                    <Component {...this.props} />
                </BodyClassName>
            );
        }
    };
}
