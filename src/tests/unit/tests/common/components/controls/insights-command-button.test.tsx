// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InsightsCommandButton', () => {
    it('renders per snapshot with props passed through', () => {
        const testSubject = shallow(<InsightsCommandButton text={'test-text'} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with extra className combined with its own', () => {
        const testSubject = shallow(<InsightsCommandButton className={'test-extra-class-name'} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
