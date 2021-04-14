// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FastPassLeftNavHamburgerButton } from 'common/components/expand-collapse-left-nav-hamburger-button';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import {
    FluentLeftNav,
    FluentLeftNavDeps,
    FluentLeftNavProps,
} from 'electron/views/left-nav/fluent-left-nav';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, MockBehavior } from 'typemoq';

describe('FluentLeftNav', () => {
    let props: FluentLeftNavProps;
    let narrowModeStatusStub: NarrowModeStatus;
    let setSideNavOpenStub: (value: boolean) => void;

    beforeEach(() => {
        narrowModeStatusStub = {
            isHeaderAndNavCollapsed: true,
        } as NarrowModeStatus;

        setSideNavOpenStub = _ => null;

        props = {
            deps: {} as FluentLeftNavDeps,
            featureFlagStoreData: {},
            selectedKey: 'automated-checks',
            isNavOpen: true,
            narrowModeStatus: narrowModeStatusStub,
            setSideNavOpen: setSideNavOpenStub,
        };
    });

    test('render left nav inside panel', () => {
        const testSubject = shallow(<FluentLeftNav {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
        expect(testSubject.find(FastPassLeftNavHamburgerButton).prop('setSideNavOpen')).toEqual(
            setSideNavOpenStub,
        );
    });

    test('render left nav by itself', () => {
        props.narrowModeStatus.isHeaderAndNavCollapsed = false;
        const testSubject = shallow(<FluentLeftNav {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('dismissing the panel uses setSideNavOpen(false)', () => {
        const setSideNavOpenMock = Mock.ofInstance((state: boolean) => {}, MockBehavior.Strict);
        props.setSideNavOpen = setSideNavOpenMock.object;
        const testSubject = shallow(<FluentLeftNav {...props} />);

        setSideNavOpenMock.setup(m => m(false)).verifiable();

        testSubject.find(GenericPanel).prop('onDismiss')();

        setSideNavOpenMock.verifyAll();
    });
});
