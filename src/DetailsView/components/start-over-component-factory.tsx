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
    withComponent: boolean
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
            // onRender: () => (
            //     <div role="menuitem">{getStartOverComponentForAssessment(props, 'left')}</div>
            // ),
            children: <div role="menuitem">{getStartOverComponentForAssessment(props, 'left')}</div>
        };
    },
};

export const QuickAssessStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => getStartOverComponentForQuickAssess(props, 'down'),
    getStartOverMenuItem: props => {
        return {
            // onRender: () => (
            //     <div role="menuitem">{getStartOverComponentForQuickAssess(props, 'left')}</div>
            // ),
            children: <div role="menuitem">{getStartOverComponentForQuickAssess(props, 'left')}</div>,
        };
    },
};

export const FastpassStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => {
        return (
            <>
                <h1>asdasdasd</h1>
                <InsightsCommandButton {...getStartOverPropsForFastPass(props)} />
            </>
        );
    },
    getStartOverMenuItem: props => getStartOverPropsForFastPassForMenu(props),
};

export function getStartOverComponentForAssessment(
    props: StartOverFactoryProps,
    dropdownDirection: DropdownDirection,
): JSX.Element {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType;
    const test = props.deps.getProvider().forType(selectedTest);
    const startOverProps: StartOverProps = {
        singleTestSuffix: test!.title,
        allTestSuffix: 'Assessment',
        dropdownDirection,
        openDialog: props.openDialog,
        buttonRef: props.buttonRef,
        rightPanelOptions: props.rightPanelConfiguration.startOverContextMenuKeyOptions,
        switcherStartOverPreferences: { showTest: true },
    };

    return <StartOverDropdown {...startOverProps} />;
}

export function getStartOverComponentForQuickAssess(
    props: StartOverFactoryProps,
    dropdownDirection: DropdownDirection,
): JSX.Element {
    // since we do not show start over per requirement in quick assess.
    const showTest = false;
    const singleTestSuffix = '';

    const startOverProps: StartOverProps = {
        singleTestSuffix,
        allTestSuffix: 'Quick Assess',
        dropdownDirection,
        openDialog: props.openDialog,
        buttonRef: props.buttonRef,
        rightPanelOptions: props.rightPanelConfiguration.startOverContextMenuKeyOptions,
        switcherStartOverPreferences: { showTest },
    };

    return <StartOverDropdown {...startOverProps} />;
}

export const startOverAutomationId = 'start-over';

export function getStartOverPropsForFastPass(props: StartOverFactoryProps): StartOverMenuItem {
    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;
    const detailsViewActionMessageCreator = props.deps.detailsViewActionMessageCreator;
    console.warn("inside getStartOverPropsForFastPass props-->", props);
    const startProps = {
        iconProps: { className: styles.startOverMenuItemIcon },
        iconName: 'ArrowClockwiseRegular',
        onClick: event => detailsViewActionMessageCreator.rescanVisualization(selectedTest, event),
        disabled: props.visualizationStoreData.scanning !== null,
        'data-automation-id': startOverAutomationId,
        text: 'Start over2222',
        className: styles.startOverMenuItem,
    }


    return { ...startProps }
}

export function getStartOverPropsForFastPassForMenu(props: StartOverFactoryProps): StartOverMenuItem {
    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;
    const detailsViewActionMessageCreator = props.deps.detailsViewActionMessageCreator;
    const startProps = {
        iconProps: { className: styles.startOverMenuItemIcon },
        iconName: 'ArrowClockwiseRegular',
        onClick: event => detailsViewActionMessageCreator.rescanVisualization(selectedTest, event),
        disabled: props.visualizationStoreData.scanning !== null,
        'data-automation-id': startOverAutomationId,
        text: 'Start over',
        className: styles.startOverMenuItem,
    }

    // if (props.withComponent) {
    //     return { children: <InsightsCommandButton {...startProps} /> }
    // }
    return { children: <InsightsCommandButton {...startProps} /> }
    //return { ...startProps }
    // return {
    //     iconProps: { className: styles.startOverMenuItemIcon },
    //     iconName: 'ArrowClockwiseRegular',
    //     onClick: event => detailsViewActionMessageCreator.rescanVisualization(selectedTest, event),
    //     disabled: props.visualizationStoreData.scanning !== null,
    //     'data-automation-id': startOverAutomationId,
    //     text: 'Start over2222',
    //     className: styles.startOverMenuItem,
    // };
    //     return {
    //         withoutComponent === true ? ...startProps: children: <InsightsCommandButton {...startProps} />
    // }
}
