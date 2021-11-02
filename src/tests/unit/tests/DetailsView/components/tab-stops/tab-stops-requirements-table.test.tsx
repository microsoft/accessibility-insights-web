// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { requirementsList } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsActionMessageCreator } from 'DetailsView/components/tab-stops/tab-stops-action-message-creator';
import { TabStopsChoiceGroupsProps } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import {
    TabStopsRequirementsTable,
    TabStopsRequirementsTableProps,
} from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { shallow } from 'enzyme';
import { DetailsList } from 'office-ui-fabric-react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { VisualizationScanResultStoreDataBuilder } from 'tests/unit/common/visualization-scan-result-store-data-builder';
import { IMock, Mock, Times } from 'typemoq';
import { TabStopRequirementContent } from 'types/tab-stop-requirement-info';

describe('TabStopsRequirementsTable', () => {
    let props: TabStopsRequirementsTableProps;
    let requirementState: TabStopRequirementState;
    let tabStopsActionMessageCreatorMock: IMock<TabStopsActionMessageCreator>;
    let requirementContentStub: {
        id: string;
    } & TabStopRequirementContent;

    beforeEach(() => {
        tabStopsActionMessageCreatorMock = Mock.ofType<TabStopsActionMessageCreator>();
        requirementState = new VisualizationScanResultStoreDataBuilder().build().tabStops
            .requirements;
        props = {
            deps: {
                tabStopsActionMessageCreator: tabStopsActionMessageCreatorMock.object,
            },
            requirementState: requirementState,
        };
        requirementContentStub = {
            id: 'test id',
            name: 'test name',
            description: 'test description',
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
        renderedProps.onGroupChoiceChange(eventStub, 'fail');
        renderedProps.onAddFailureInstanceClicked(eventStub);

        tabStopsActionMessageCreatorMock.verify(
            m => m.onUndoClicked(actualRequirement.id),
            Times.once(),
        );
        tabStopsActionMessageCreatorMock.verify(
            m => m.onRequirementStatusChange(actualRequirement.id, 'fail'),
            Times.once(),
        );
        tabStopsActionMessageCreatorMock.verify(
            m => m.onAddFailureInstance(actualRequirement.id),
            Times.once(),
        );
    });
});
