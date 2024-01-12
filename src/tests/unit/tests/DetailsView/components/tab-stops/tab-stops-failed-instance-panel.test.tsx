// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { fireEvent, render, screen } from '@testing-library/react';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import {
    TabStopsFailedInstancePanel,
    TabStopsFailedInstancePanelDeps,
    TabStopsFailedInstancePanelProps,
} from 'DetailsView/components/tab-stops/tab-stops-failed-instance-panel';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { FailureInstanceState } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';

import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { TabStopRequirementId, TabStopRequirementInfo } from 'types/tab-stop-requirement-info';

describe('TabStopsFailedInstancePanel', () => {
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


        const result = render(<TabStopsFailedInstancePanel {...props} />);
        const getConfirmButton = screen.getByText('Add failed instance');
        const getTexFieldValue = screen.getByLabelText('Comment')
        //mock click behaviour for confirm button
        fireEvent.click(getConfirmButton)
        //mock onChange behaviour for input field
        fireEvent.change(getTexFieldValue, { target: { value: 'test' } })
        expect(result.asFragment()).toMatchSnapshot();
    });

    test('render with failure instance action type EDIT', () => {
        const requirementId: TabStopRequirementId = 'focus-indicator';
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
                actionType: CapturedInstanceActionType.EDIT,
            },
        };
        const result = render(<TabStopsFailedInstancePanel {...props} />);
        //mock click behaviour for save button
        const getSaveButton = screen.getByText('Save');
        fireEvent.click(getSaveButton)
        expect(result.asFragment()).toMatchSnapshot();

    });

    test('render with failure instance action type EDIT with description value as null', () => {
        const requirementId: TabStopRequirementId = 'focus-indicator';
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
                description: null,
                actionType: CapturedInstanceActionType.EDIT,
            },
        };
        const result = render(<TabStopsFailedInstancePanel {...props} />);
        //mock click behaviour for save button
        const getSaveButton = screen.getByText('Save');
        fireEvent.click(getSaveButton)
        expect(result.asFragment()).toMatchSnapshot();

    });
});
