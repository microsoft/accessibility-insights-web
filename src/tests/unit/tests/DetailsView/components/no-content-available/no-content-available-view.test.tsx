// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    NoContentAvailableView,
    NoContentAvailableViewDeps,
} from 'DetailsView/components/no-content-available/no-content-available-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('NoContentAvailableView', () => {
    it('renders', () => {
        const depsStub: NoContentAvailableViewDeps = {
            textContent: {
                applicationTitle: 'test-application-title',
            },
        } as NoContentAvailableViewDeps;

        const wrapped = shallow(<NoContentAvailableView deps={depsStub} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
