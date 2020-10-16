// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import {
    FluentLeftNav,
    FluentLeftNavDeps,
    FluentLeftNavProps,
} from 'electron/views/left-nav/fluent-left-nav';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('FluentLeftNav', () => {
    let props: FluentLeftNavProps;
    let narrowModeStatusStub: NarrowModeStatus;

    beforeEach(() => {
        narrowModeStatusStub = {
            isHeaderAndNavCollapsed: true,
        } as NarrowModeStatus;

        props = {
            deps: {} as FluentLeftNavDeps,
            selectedKey: 'automated-checks',
            isNavOpen: true,
            narrowModeStatus: narrowModeStatusStub,
        };
    });

    test('render left nav inside panel', () => {
        const testSubject = shallow(<FluentLeftNav {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('render left nav by itself', () => {
        props.narrowModeStatus.isHeaderAndNavCollapsed = false;
        const testSubject = shallow(<FluentLeftNav {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
