// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { FailedInstancePanel } from 'DetailsView/components/tab-stops/failed-instance-panel';
import {
    TabStopsFailedInstancePanel,
    TabStopsFailedInstancePanelDeps,
    TabStopsFailedInstancePanelProps,
} from 'DetailsView/components/tab-stops/tab-stops-failed-instance-panel';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { FailureInstanceState } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';

import * as React from 'react';
import { getMockComponentClassPropsForCall, mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';
import { TabStopRequirementId, TabStopRequirementInfo } from 'types/tab-stop-requirement-info';

jest.mock('DetailsView/components/tab-stops/failed-instance-panel');

describe('TabStopsFailedInstancePanel', () => {
    mockReactComponents([FailedInstancePanel])
    let props: TabStopsFailedInstancePanelProps;
    let tabStopRequirementsStub: TabStopRequirementInfo;
    let tabStopsTestViewControllerMock: IMock<TabStopsTestViewController>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let failureState: FailureInstanceState;

    beforeEach(() => {
        const requirementId: TabStopRequirementId = 'focus-indicator';
        tabStopRequirementsStub = {
            [requirementId]: {
                name: 'some name for requirement',
            },
        } as TabStopRequirementInfo;
        tabStopsTestViewControllerMock = Mock.ofType<TabStopsTestViewController>();
        tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>();
        failureState = {
            isPanelOpen: true,
            selectedRequirementId: requirementId,
            selectedInstanceId: 'some instance id',
            description: 'some description',
            actionType: CapturedInstanceActionType.CREATE,
        };
        props = {
            deps: {
                tabStopRequirements: tabStopRequirementsStub,
                tabStopsTestViewController: tabStopsTestViewControllerMock.object,
                tabStopRequirementActionMessageCreator:
                    tabStopRequirementActionMessageCreatorMock.object,
            } as TabStopsFailedInstancePanelDeps,
            failureInstanceState: failureState,
        };
    });

    test('render with no selected requirement id', () => {
        props.failureInstanceState.selectedRequirementId = null;
        const testSubject = render(<TabStopsFailedInstancePanel {...props} />);

        expect(testSubject.asFragment()).toMatchSnapshot();
    });

    test('render with failure instance action type CREATE', async () => {
        const requirementId: TabStopRequirementId = 'focus-indicator';
        const description = 'description';
        props = {
            deps: {
                tabStopRequirements: tabStopRequirementsStub,
                tabStopsTestViewController: tabStopsTestViewControllerMock.object,
                tabStopRequirementActionMessageCreator:
                    tabStopRequirementActionMessageCreatorMock.object,
            } as TabStopsFailedInstancePanelDeps,
            failureInstanceState: {
                isPanelOpen: true,
                selectedRequirementId: requirementId,
                selectedInstanceId: 'some instance id',
                description: 'some description',
                actionType: CapturedInstanceActionType.CREATE,
            },
        };
        const testSubject = render(<TabStopsFailedInstancePanel {...props} />);
        const getFailedInstanceProps = getMockComponentClassPropsForCall(FailedInstancePanel);
        getFailedInstanceProps.onConfirm();
        getFailedInstanceProps.onChange(null, description);
        getFailedInstanceProps.onDismiss();
        expect(testSubject.asFragment()).toMatchSnapshot();
        tabStopsTestViewControllerMock.verify(m => m.dismissPanel(), Times.once());
        tabStopsTestViewControllerMock.verify(m => m.updateDescription(description), Times.once());
        tabStopRequirementActionMessageCreatorMock.verify(
            m =>
                m.addTabStopInstance(
                    It.isValue({
                        requirementId: failureState.selectedRequirementId,
                        description: failureState.description,
                    }),
                ),
            Times.once(),
        );
    });

    test('render with failure instance action type EDIT', () => {
        const description = 'description';
        props.failureInstanceState.actionType = CapturedInstanceActionType.EDIT;
        const testSubject = render(<TabStopsFailedInstancePanel {...props} />);
        const panelProps = getMockComponentClassPropsForCall(FailedInstancePanel);
        panelProps.onConfirm();
        panelProps.onChange(null, description);
        panelProps.onDismiss();

        expect(testSubject.asFragment()).toMatchSnapshot();
        tabStopsTestViewControllerMock.verify(m => m.dismissPanel(), Times.once());
        tabStopsTestViewControllerMock.verify(m => m.updateDescription(description), Times.once());
        tabStopRequirementActionMessageCreatorMock.verify(
            m =>
                m.updateTabStopInstance(
                    failureState.selectedRequirementId,
                    failureState.selectedInstanceId,
                    failureState.description,
                ),
            Times.once(),
        );
    });
});
