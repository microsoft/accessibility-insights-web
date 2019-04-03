// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { configMutator } from '../../../../../common/configuration';
import { Page, PageDeps } from '../../../../../views/page/page';

configMutator.setOption('extensionFullName', 'EXTENSION_NAME');

describe('page view', () => {
    it('renders', () => {
        const wrapper = shallow(<Page deps={{} as PageDeps}>INSIDE</Page>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
