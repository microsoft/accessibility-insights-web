// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IContextualMenuItem } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
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
import { MyFunctionType } from 'DetailsView/components/details-view-command-bar';

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
    buttonRef: MyFunctionType;
    hasSubMenu?: boolean;
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
            children: <div>{getStartOverComponentForAssessment(props, 'left')}</div>,
        };
    },
};

export const QuickAssessStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => getStartOverComponentForQuickAssess(props, 'down'),
    getStartOverMenuItem: props => {
        return {
            children: <div>{getStartOverComponentForQuickAssess(props, 'left')}</div>,
        };
    },
};

export const FastpassStartOverFactory: StartOverComponentFactory = {
    getStartOverComponent: props => getStartOverComponentFastPass(props),
    getStartOverMenuItem: props => {
        return {
            children: <div>{getStartOverComponentFastPass(props)}</div>,
        };
    },
};

export function getStartOverComponentFastPass(props: StartOverFactoryProps): JSX.Element {
    const startOverProps = getStartOverPropsForFastPass(props);
    return (
        <InsightsCommandButton
            insightsCommandButtonIconProps={{
                icon: <FluentUIV9Icon iconName="ArrowClockwiseRegular" />,
            }}
            {...startOverProps}
        >
            {startOverProps.text}
        </InsightsCommandButton>
    );
}

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
        hasSubMenu: props.hasSubMenu,
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
        hasSubMenu: props.hasSubMenu,
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
