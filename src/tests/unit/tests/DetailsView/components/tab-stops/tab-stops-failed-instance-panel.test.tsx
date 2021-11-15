// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
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
        const testSubject = shallow(<TabStopsFailedInstancePanel {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('render with failure instance action type CREATE', () => {
        const description = 'description';

        const testSubject = shallow(<TabStopsFailedInstancePanel {...props} />);
        const panelProps = testSubject.find(FailedInstancePanel).props();
        panelProps.onConfirm();
        panelProps.onChange(null, description);
        panelProps.onDismiss();

        expect(testSubject.getElement()).toMatchSnapshot();
        tabStopsTestViewControllerMock.verify(m => m.dismissPanel(), Times.once());
        tabStopsTestViewControllerMock.verify(m => m.updateDescription(description), Times.once());
        tabStopRequirementActionMessageCreatorMock.verify(
            m => m.addTabStopInstance(failureState.selectedRequirementId, failureState.description),
            Times.once(),
        );
    });

    test('render with failure instance action type EDIT', () => {
        const description = 'description';
        props.failureInstanceState.actionType = CapturedInstanceActionType.EDIT;
        const testSubject = shallow(<TabStopsFailedInstancePanel {...props} />);
        const panelProps = testSubject.find(FailedInstancePanel).props();
        panelProps.onConfirm();
        panelProps.onChange(null, description);
        panelProps.onDismiss();

        expect(testSubject.getElement()).toMatchSnapshot();
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
