// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import * as React from 'react';

import { DefaultThemePalette } from '../styles/default-theme-palette';
import { HighContrastThemePalette } from '../styles/high-contrast-theme-palette';
import { UserConfigurationStoreData } from '../types/store-data/user-configuration-store';
import { BodyClassModifier } from './body-class-modifier';
import { withStoreSubscription, WithStoreSubscriptionDeps } from './with-store-subscription';

export interface ThemeInnerState {
    userConfigurationStoreData: UserConfigurationStoreData;
}
export type ThemeInnerProps = {
    deps: ThemeDeps;
    storeState: ThemeInnerState;
};
export type ThemeDeps = WithStoreSubscriptionDeps<ThemeInnerState> & {
    documentManipulator: DocumentManipulator;
    loadTheme: (theme) => void;
};

export class ThemeInner extends React.Component<ThemeInnerProps> {
    public componentDidMount(): void {
        this.loadAppropriateTheme(this.isHighContrastEnabled(this.props));
    }

    public componentDidUpdate(prevProps): void {
        const enableHighContrastCurr = this.isHighContrastEnabled(this.props);
        const enableHighContrastPrev = this.isHighContrastEnabled(prevProps);
        if (enableHighContrastCurr === enableHighContrastPrev) {
            return;
        }
        this.loadAppropriateTheme(enableHighContrastCurr);
    }

    public render(): JSX.Element {
        const classNames = ['theme-switcher'];

        if (this.isHighContrastEnabled(this.props)) {
            classNames.push('high-contrast-theme');
        }

        return <BodyClassModifier deps={this.props.deps} classNames={classNames} />;
    }

    private loadAppropriateTheme(isHighContrast: boolean): void {
        const appropriateTheme = isHighContrast ? HighContrastThemePalette : DefaultThemePalette;
        this.props.deps.loadTheme(appropriateTheme);
    }

    private isHighContrastEnabled(props: ThemeInnerProps): boolean {
        const { storeState } = props;
        const { userConfigurationStoreData } = storeState;

        const enableHighContrastFlag =
            storeState &&
            userConfigurationStoreData &&
            userConfigurationStoreData.enableHighContrast;

        return enableHighContrastFlag;
    }
}

export const Theme = withStoreSubscription<ThemeInnerProps, ThemeInnerState>(ThemeInner);
