// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import {
    FailedInstancePanel,
    FailedInstancePanelProps,
} from 'DetailsView/components/tab-stops/failed-instance-panel';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { FailureInstanceState } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import * as React from 'react';
import { TabStopRequirementInfo } from 'types/tab-stop-requirement-info';

export type TabStopsFailedInstancePanelDeps = {
    tabStopRequirements: TabStopRequirementInfo;
    tabStopsTestViewController: TabStopsTestViewController;
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
};

export interface TabStopsFailedInstancePanelProps {
    deps: TabStopsFailedInstancePanelDeps;
    failureInstanceState: FailureInstanceState;
}

export const TabStopsFailedInstancePanel = NamedFC<TabStopsFailedInstancePanelProps>(
    'TabStopsFailedInstancePanel',
    props => {
        const { deps, failureInstanceState } = props;
        const {
            tabStopRequirements,
            tabStopsTestViewController,
            tabStopRequirementActionMessageCreator,
        } = deps;

        if (failureInstanceState.selectedRequirementId === null) {
            return null;
        }

        let failureInstanceProps: FailedInstancePanelProps = {
            headerText: `Add a failed instance for ${
                tabStopRequirements[failureInstanceState.selectedRequirementId].name
            }`,
            isOpen: failureInstanceState.isPanelOpen,
            instanceDescription: failureInstanceState.description,
            confirmButtonText: 'Add failed instance',
            onConfirm: () => {
                tabStopRequirementActionMessageCreator.addTabStopInstance({
                    description: failureInstanceState.description!,
                    requirementId: failureInstanceState.selectedRequirementId!,
                });
            },
            onChange: async (_, description) =>
                await deps.tabStopsTestViewController.updateDescription(description),
            onDismiss: tabStopsTestViewController.dismissPanel,
        };

        if (failureInstanceState.actionType === CapturedInstanceActionType.EDIT) {
            failureInstanceProps = {
                ...failureInstanceProps,
                headerText: `Edit failed instance for ${
                    tabStopRequirements[failureInstanceState.selectedRequirementId].name
                }`,
                onConfirm: () => {
                    tabStopRequirementActionMessageCreator.updateTabStopInstance(
                        failureInstanceState.selectedRequirementId!,
                        failureInstanceState.selectedInstanceId!,
                        failureInstanceState.description!,
                    );
                },
                confirmButtonText: 'Save',
            };
        }

        return <FailedInstancePanel {...failureInstanceProps} />;
    },
);
