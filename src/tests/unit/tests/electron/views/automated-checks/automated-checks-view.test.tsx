// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecksView, AutomatedChecksViewProps } from 'electron/views/automated-checks/components/automated-checks-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AutomatedChecksView', () => {
    it('renders the automated checks view', () => {
        const props: AutomatedChecksViewProps = {
            deps: {
                deviceConnectActionCreator: null,
            },
        };

        const wrapped = shallow(<AutomatedChecksView {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot('automated checks view');
    });
});
