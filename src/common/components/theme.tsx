// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PartialTheme, ThemeProvider } from '@fluentui/react';
import {
    FluentProvider,
    Theme as ThemeV9,
    webDarkTheme,
    webLightTheme,
} from '@fluentui/react-components';
import { DocumentManipulator } from 'common/document-manipulator';
import { ThemeV9DarkTheme } from 'common/styles/theme-v9-dark-theme';
import * as React from 'react';
import { DefaultTheme } from '../styles/default-theme';
import { HighContrastTheme } from '../styles/high-contrast-theme';
import { UserConfigurationStoreData } from '../types/store-data/user-configuration-store';
import { BodyClassModifier } from './body-class-modifier';
import { withStoreSubscription, WithStoreSubscriptionDeps } from './with-store-subscription';

export interface ThemeInnerState {
    userConfigurationStoreData: UserConfigurationStoreData;
}

export interface ThemeState {
    themeValueV8: PartialTheme;
    themeValueV9: ThemeV9;
}

export type ThemeInnerProps = {
    deps: ThemeDeps;
    storeState: ThemeInnerState;
};
export type ThemeDeps = WithStoreSubscriptionDeps<ThemeInnerState> & {
    documentManipulator: DocumentManipulator;
};

export class ThemeInner extends React.Component<ThemeInnerProps, ThemeState> {
    constructor(props) {
        super(props);
        this.state = {
            themeValueV8: DefaultTheme,
            themeValueV9: webLightTheme,
        };
    }
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

        return (
            <ThemeProvider applyTo="body" theme={this.state.themeValueV8}>
                <FluentProvider theme={this.state.themeValueV9}>
                    <BodyClassModifier deps={this.props.deps} classNames={classNames} />
                    {this.props.children}
                </FluentProvider>
            </ThemeProvider>
        );
    }

    private loadAppropriateTheme(isHighContrast: boolean): void {
        const appropriateThemeV8 = isHighContrast ? HighContrastTheme : DefaultTheme;
        const appropriateThemeV9 = isHighContrast ? ThemeV9DarkTheme : webLightTheme;
        this.setState({ themeValueV8: appropriateThemeV8, themeValueV9: appropriateThemeV9 });
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
