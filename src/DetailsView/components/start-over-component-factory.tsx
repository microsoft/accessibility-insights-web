// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButton, IContextualMenuItem, IRefObject } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from 'DetailsView/components/details-view-right-panel';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import {
    DropdownDirection,
    StartOverDropdown,
    StartOverProps,
} from 'DetailsView/components/start-over-dropdown';
import * as React from 'react';
import styles from './start-over-menu-item.scss';

export type StartOverFactoryDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    getProvider: () => AssessmentsProvider;
};

export type StartOverFactoryProps = {
    deps: StartOverFactoryDeps;
    assessmentStoreData: AssessmentStoreData;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    visualizationStoreData: VisualizationStoreData;
    openDialog: (dialogType: StartOverDialogType) => void;
    buttonRef: IRefObject<IButton>;
};

export type StartOverMenuItem = Omit<IContextualMenuItem, 'key'>;

export interface StartOverComponentFactory {
    getStartOverComponent: (props: StartOverFactoryProps) => JSX.Element;
    getStartOverMenuItem: (props: StartOverFactoryProps) => StartOverMenuItem;
}

export const AssessmentStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => getStartOverComponentForAssessment(props, 'down'),
    getStartOverMenuItem: props => {
        return {
            onRender: () => (
                <div role="menuitem">{getStartOverComponentForAssessment(props, 'left')}</div>
            ),
        };
    },
};

export const QuickAssessStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => getStartOverComponentForQuickAssess(props, 'down'),
    getStartOverMenuItem: props => {
        return {
            onRender: () => (
                <div role="menuitem">{getStartOverComponentForQuickAssess(props, 'left')}</div>
            ),
        };
    },
};

export const FastpassStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => {
        return <InsightsCommandButton {...getStartOverPropsForFastPass(props)} />;
    },
    getStartOverMenuItem: getStartOverPropsForFastPass,
};

export function getStartOverComponentForAssessment(
    props: StartOverFactoryProps,
    dropdownDirection: DropdownDirection,
): JSX.Element {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType;
    const test = props.deps.getProvider().forType(selectedTest);
    const startOverProps: StartOverProps = {
        singleTestSuffix: test.title,
        allTestSuffix: 'Assessment',
        dropdownDirection,
        openDialog: props.openDialog,
        buttonRef: props.buttonRef,
        rightPanelOptions: props.rightPanelConfiguration.startOverContextMenuKeyOptions,
        switcherStartOverPreferences: { showAssessment: true, showTest: true },
    };

    return <StartOverDropdown {...startOverProps} />;
}

export function getStartOverComponentForQuickAssess(
    props: StartOverFactoryProps,
    dropdownDirection: DropdownDirection,
): JSX.Element {
    const { selectedTestSubview, selectedTestType } = props.assessmentStoreData.assessmentNavState;
    const test = props.deps.getProvider().getStep(selectedTestType, selectedTestSubview);
    const startOverProps: StartOverProps = {
        singleTestSuffix: test.name,
        allTestSuffix: 'Quick Assess',
        dropdownDirection,
        openDialog: props.openDialog,
        buttonRef: props.buttonRef,
        rightPanelOptions: props.rightPanelConfiguration.startOverContextMenuKeyOptions,
        switcherStartOverPreferences: { showAssessment: true, showTest: false },
    };

    return <StartOverDropdown {...startOverProps} />;
}

export const startOverAutomationId = 'start-over';

export function getStartOverPropsForFastPass(props: StartOverFactoryProps): StartOverMenuItem {
    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;
    const detailsViewActionMessageCreator = props.deps.detailsViewActionMessageCreator;

    return {
        iconProps: { iconName: 'Refresh', className: styles.startOverMenuItemIcon },
        onClick: event => detailsViewActionMessageCreator.rescanVisualization(selectedTest, event),
        disabled: props.visualizationStoreData.scanning !== null,
        'data-automation-id': startOverAutomationId,
        text: 'Start over',
        className: styles.startOverMenuItem,
    };
}
