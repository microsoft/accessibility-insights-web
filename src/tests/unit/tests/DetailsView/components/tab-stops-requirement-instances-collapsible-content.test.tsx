// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsRequirementInstancesCollapsibleContent } from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { mount, shallow } from 'enzyme';
import { Link } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('TabStopsRequirementInstancesCollapsibleContent', () => {
    let onEditButtonClickedMock: IMock<(requirementId: string) => void>;
    let onRemoveButtonClickedMock: IMock<(requirementId: string) => void>;
    let props;

    beforeEach(() => {
        onEditButtonClickedMock = Mock.ofType<(requirementId: string) => void>();
        onRemoveButtonClickedMock = Mock.ofType<(requirementId: string) => void>();

        props = {
            instances: [{ id: 'test-requirement-id', description: 'test-description' }],
            onEditButtonClicked: onEditButtonClickedMock.object,
            onRemoveButtonClicked: onRemoveButtonClickedMock.object,
        };
    });

    it('renders', () => {
        const wrapper = shallow(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('click events pass through as expected', () => {
        onEditButtonClickedMock.setup(ebc => ebc('test-requirement-id')).verifiable(Times.once());
        onRemoveButtonClickedMock.setup(rbc => rbc('test-requirement-id')).verifiable(Times.once());
        const testSubject = mount(
            <TabStopsRequirementInstancesCollapsibleContent
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
