// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsList } from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import {
    TabStopRequirementState,
    TabStopRequirementStatuses,
} from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { requirementsList } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsChoiceGroupsProps } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import {
    TabStopsRequirementsTable,
    TabStopsRequirementsTableProps,
} from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { shallow } from 'enzyme';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { VisualizationScanResultStoreDataBuilder } from 'tests/unit/common/visualization-scan-result-store-data-builder';
import { IMock, Mock, Times } from 'typemoq';
import { TabStopRequirementContent } from 'types/tab-stop-requirement-info';

describe('TabStopsRequirementsTable', () => {
    let props: TabStopsRequirementsTableProps;
    let requirementState: TabStopRequirementState;
    let tabStopsRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let requirementContentStub: {
        id: string;
    } & TabStopRequirementContent;
    let tabStopsTestViewControllerMock: IMock<TabStopsTestViewController>;

    beforeEach(() => {
        tabStopsTestViewControllerMock = Mock.ofType<TabStopsTestViewController>();
        tabStopsRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>();
        requirementState = new VisualizationScanResultStoreDataBuilder().build().tabStops
            .requirements;
        props = {
            deps: {
                tabStopRequirementActionMessageCreator:
                    tabStopsRequirementActionMessageCreatorMock.object,
                tabStopsTestViewController: tabStopsTestViewControllerMock.object,
            },
            requirementState: requirementState,
        };
        requirementContentStub = {
            id: 'test id',
            name: 'test name',
            description: 'test description',
            guidance: [],
        };
    });

    test('renders table', () => {
        const testSubject = shallow(<TabStopsRequirementsTable {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('renders requirement column', () => {
        const testSubject = shallow(<TabStopsRequirementsTable {...props} />);
        const columns = testSubject.find(DetailsList).props().columns;
        expect(columns[0].onRender(requirementContentStub)).toMatchSnapshot();
    });

    test('renders result column', () => {
        const testSubject = shallow(<TabStopsRequirementsTable {...props} />);
        const columns = testSubject.find(DetailsList).props().columns;
        const tabStopsChoiceGroup = columns[1].onRender(requirementsList[0]);
        expect(tabStopsChoiceGroup).toMatchSnapshot();
    });

    test('result column handlers', () => {
        const eventStub = new EventStubFactory().createKeypressEvent() as SupportedMouseEvent;
        const actualRequirement = requirementsList[0]; // must match with state from builder which uses actual requirement.
        const testSubject = shallow(<TabStopsRequirementsTable {...props} />);
        const columns = testSubject.find(DetailsList).props().columns;
        const tabStopsChoiceGroup = columns[1].onRender(actualRequirement) as JSX.Element;
        const renderedProps = tabStopsChoiceGroup.props as TabStopsChoiceGroupsProps;

        renderedProps.onUndoClicked(eventStub);
        renderedProps.onGroupChoiceChange(eventStub, TabStopRequirementStatuses.fail);
        renderedProps.onAddFailureInstanceClicked(eventStub);

        tabStopsRequirementActionMessageCreatorMock.verify(
            m => m.resetStatusForRequirement(actualRequirement.id),
            Times.once(),
        );
        tabStopsRequirementActionMessageCreatorMock.verify(
            m => m.updateTabStopRequirementStatus(actualRequirement.id, 'fail'),
            Times.once(),
        );
        tabStopsTestViewControllerMock.verify(
            m => m.createNewFailureInstancePanel(actualRequirement.id),
            Times.once(),
        );
    });
});
