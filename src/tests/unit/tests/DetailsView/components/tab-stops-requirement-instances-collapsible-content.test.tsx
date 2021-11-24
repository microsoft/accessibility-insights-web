// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TabStopsRequirementInstancesCollapsibleContent,
    TabStopsRequirementInstancesCollapsibleContentProps,
} from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { TabStopsRequirementResultInstance } from 'DetailsView/tab-stops-requirement-result';
import { mount, shallow } from 'enzyme';
import { DetailsList, Link } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

describe('TabStopsRequirementInstancesCollapsibleContent', () => {
    let onEditButtonClickedMock: IMock<
        (requirementId: TabStopRequirementId, instanceId: string, description: string) => void
    >;
    let onRemoveButtonClickedMock: IMock<
        (requirementId: TabStopRequirementId, instanceId: string) => void
    >;
    let props: TabStopsRequirementInstancesCollapsibleContentProps;
    let requirementResultInstanceStub: TabStopsRequirementResultInstance;

    beforeEach(() => {
        onEditButtonClickedMock =
            Mock.ofType<
                (
                    requirementId: TabStopRequirementId,
                    instanceId: string,
                    description: string,
                ) => void
            >();
        onRemoveButtonClickedMock =
            Mock.ofType<(requirementId: TabStopRequirementId, instanceId: string) => void>();

        props = {
            requirementId: 'keyboard-navigation',
            instances: [{ id: 'test-instance-id', description: 'test-description' }],
            onEditButtonClicked: onEditButtonClickedMock.object,
            onRemoveButtonClicked: onRemoveButtonClickedMock.object,
        };

        requirementResultInstanceStub = {
            id: 'test-instance-id',
            description: 'test requirement description',
        };
    });

    it('renders', () => {
        const wrapper = shallow(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('renders captured instance details column', () => {
        const testSubject = shallow(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        const columns = testSubject.find(DetailsList).props().columns;
        expect(columns[0].onRender(requirementResultInstanceStub)).toMatchSnapshot();
    });

    test('renders captured instance icons column', () => {
        const testSubject = shallow(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        const columns = testSubject.find(DetailsList).props().columns;
        expect(columns[1].onRender(requirementResultInstanceStub)).toMatchSnapshot();
    });

    test('click events pass through as expected', () => {
        onEditButtonClickedMock
            .setup(ebc => ebc('keyboard-navigation', 'test-instance-id', 'test-description'))
            .verifiable(Times.once());
        onRemoveButtonClickedMock
            .setup(rbc => rbc(props.requirementId, 'test-instance-id'))
            .verifiable(Times.once());
        const testSubject = mount(
            <TabStopsRequirementInstancesCollapsibleContent
                requirementId={props.requirementId}
                instances={props.instances}
                onEditButtonClicked={onEditButtonClickedMock.object}
                onRemoveButtonClicked={onRemoveButtonClickedMock.object}
            />,
        );
        testSubject
            .find(Link)
            .find('button')
            .forEach(wrapper => wrapper.simulate('click'));

        onEditButtonClickedMock.verifyAll();
        onRemoveButtonClickedMock.verifyAll();
    });
});
