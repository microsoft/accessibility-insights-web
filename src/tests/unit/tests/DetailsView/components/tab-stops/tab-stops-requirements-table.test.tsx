// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { fireEvent, render, screen } from '@testing-library/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import {
    TabStopRequirementState,
    TabStopRequirementStatuses,
} from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import {
    TabStopsRequirementsTable,
    TabStopsRequirementsTableProps,
} from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';

import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { VisualizationScanResultStoreDataBuilder } from 'tests/unit/common/visualization-scan-result-store-data-builder';
import { IMock, Mock } from 'typemoq';
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
            status: 'fail'
        };
        requirementContentStub = {
            id: 'test id',
            name: 'test name',
            description: 'test description',
            guidance: [],
        };
    });

    test('renders table', () => {
        const testSubject = render(<TabStopsRequirementsTable {...props} />);
        expect(testSubject.asFragment()).toMatchSnapshot();
    });

    test('renders requirement column', () => {
        const testSubject = render(<TabStopsRequirementsTable {...props} />);
        const hasColumns = testSubject.container.querySelectorAll('.ms-details')
        expect(hasColumns).toMatchSnapshot();
    });

    test('renders result column', () => {
        const testSubject = render(<TabStopsRequirementsTable {...props} />);

        const tabStopsChoiceGroup = testSubject.container.querySelectorAll('.ms-ChoiceFieldGroup')
        expect(tabStopsChoiceGroup).toMatchSnapshot();
    });

    test('renders undo icon button', async () => {

        props.requirementState['input-focus'].status = TabStopRequirementStatuses.fail;

        const testSubject = render(<TabStopsRequirementsTable {...props} />);

        expect(testSubject).toMatchSnapshot();
    });

    test('result column handlers', () => {
        //update props to make sure Undo button is visible
        props.requirementState['input-focus'].status = TabStopRequirementStatuses.pass;
        const eventStub = new EventStubFactory().createMouseClickEvent() as SupportedMouseEvent;

        const testSubject = render(<TabStopsRequirementsTable {...props} />);

        const undoButton = testSubject.container.querySelectorAll('.ms-Button--icon')
        const choiceGroupChange = testSubject.container.querySelectorAll('.ms-ChoiceFieldGroup')

        fireEvent.click(undoButton[0], eventStub)
        fireEvent.change(choiceGroupChange[0], eventStub)
    });

    test('render Add icon button and handle event', () => {
        //update props to make sure Undo button is visible
        props.requirementState['input-focus'].status = TabStopRequirementStatuses.fail;
        const eventStub = new EventStubFactory().createMouseClickEvent() as SupportedMouseEvent;

        render(<TabStopsRequirementsTable {...props} />);

        const addButton = screen.getAllByLabelText('add failure instance')

        fireEvent.click(addButton[0], eventStub)

    });

});
