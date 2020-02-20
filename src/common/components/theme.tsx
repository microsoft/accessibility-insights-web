// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { DocumentManipulator } from 'common/document-manipulator';
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
    public componentDidUpdate(prevProps): void {
        const enableHighContrastCurr = this.isHighContrastEnabled(this.props);
        const enableHighContrastPrev = this.isHighContrastEnabled(prevProps);
        if (enableHighContrastCurr === enableHighContrastPrev) {
            return;
        }
        this.props.deps.loadTheme(
            enableHighContrastCurr ? HighContrastThemePalette : DefaultThemePalette,
        );
    }

    public render(): JSX.Element {
        const enableHighContrast = this.isHighContrastEnabled(this.props);
        const classNames = enableHighContrast ? ['high-contrast-theme'] : [];

        return (
            <BodyClassModifier
                documentManipulator={this.props.deps.documentManipulator}
                classNames={classNames}
            />
        );
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
