// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { StaticRouter } from 'react-router';

import { RouterDeps, RouterSwitch } from 'views/insights/router';

describe('router', () => {
    const deps = 'DEPS' as Partial<RouterDeps> as RouterDeps;
    const context = {};

    it('renders content page', () => {
        const result = shallow(
            <StaticRouter location="/content/the-content-path" context={context}>
                <RouterSwitch deps={deps} />
            </StaticRouter>,
        );

        const routerSwitch = result.find('RouterSwitch').dive();
        expect(routerSwitch.debug()).toMatchSnapshot();
    });
});
