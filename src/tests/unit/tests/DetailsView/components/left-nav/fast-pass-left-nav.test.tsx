// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    FastPassLeftNav,
    FastPassLeftNavDeps,
    FastPassLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/fast-pass-left-nav';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';

describe(FastPassLeftNav, () => {
    it('renders visualization based left nav with appropriate params', () => {
        const onRightPanelContentSwitch: () => void = () => {};
        const navLinkHandlerStub: NavLinkHandler = {
            onFastPassTestClick: (e, link) => null,
        } as NavLinkHandler;
        const deps: FastPassLeftNavDeps = {
            navLinkHandler: navLinkHandlerStub,
        } as FastPassLeftNavDeps;
        const props: FastPassLeftNavProps = {
            deps,
            selectedKey: 'some string',
            onRightPanelContentSwitch,
        };

        const actual = shallow(<FastPassLeftNav {...props} />);
        expect(actual.debug()).toMatchSnapshot();
    });
});
