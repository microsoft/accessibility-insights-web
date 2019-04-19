// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { BugFilingChoiceGroup, BugFilingChoiceGroupProps } from '../../../../../bug-filing/components/bug-filing-choice-group';
import { OnSelectedServiceChange } from '../../../../../bug-filing/components/bug-filing-settings-container';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';

describe('BugFilingChoiceGroupTest', () => {
    let onServiceChangeMock: IMock<OnSelectedServiceChange>;
    const testKey = 'test bug service key';
    const testName = 'test bug service name';
    const testOption: IChoiceGroupOption = {
        key: testKey,
        text: testName,
    };
    const selectedBugFilingService = {
        key: testKey,
        displayName: testName,
    } as BugFilingService;
    const services = [selectedBugFilingService];

    beforeEach(() => {
        onServiceChangeMock = Mock.ofInstance(_ => null);
    });

    test('render', () => {
        const props: BugFilingChoiceGroupProps = {
            selectedBugFilingService,
            bugFilingServices: services,
            onSelectedServiceChange: onServiceChangeMock.object,
        };

        const wrapper = shallow(<BugFilingChoiceGroup {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('onChange', () => {
        const props: BugFilingChoiceGroupProps = {
            selectedBugFilingService,
            bugFilingServices: services,
            onSelectedServiceChange: onServiceChangeMock.object,
        };

        onServiceChangeMock.setup(u => u(testOption.key)).verifiable(Times.once());

        const wrapper = shallow(<BugFilingChoiceGroup {...props} />);
        wrapper
            .find(ChoiceGroup)
            .props()
            .onChange(null, testOption);
        onServiceChangeMock.verifyAll();
    });
});
