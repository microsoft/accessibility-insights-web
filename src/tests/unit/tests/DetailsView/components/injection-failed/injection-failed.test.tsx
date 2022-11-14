// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionFailed } from 'DetailsView/components/injection-failed/injection-failed';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InjectionFailed', () => {
    it('renders stale view for default', () => {
        const testSubject = shallow(<InjectionFailed />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
