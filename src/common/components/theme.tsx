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

export interface ThemeProps {
    userConfigurationStore: IBaseStore<UserConfigurationStoreData>;
}

export class Theme extends React.Component<ThemeProps, ThemeState> {
    constructor(props: any) {
        super(props);
        const storeState = this.props.userConfigurationStore.getState();
        this.state = { isHighContrastEnabled: storeState && storeState.enableTelemetry };
    }

    public componentDidMount(): void {
        this.props.userConfigurationStore.addChangedListener(this.updateState);
    }

    public updateState = () => {
        const storeState = this.props.userConfigurationStore.getState();
        this.setState({ isHighContrastEnabled: storeState && storeState.enableTelemetry });
    }

    public render(): JSX.Element {
        const className = `theme-switcher${this.state.isHighContrastEnabled ? ' high-contrast-theme' : ''}`;
        return (
            <BodyClassName className={className}>
            </BodyClassName>
        );
    }
}
