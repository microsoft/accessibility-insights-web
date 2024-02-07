// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    FastPassLeftNav,
    FastPassLeftNavDeps,
    FastPassLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/fast-pass-left-nav';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import { VisualizationBasedLeftNav } from '../../../../../../DetailsView/components/left-nav/visualization-based-left-nav';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../DetailsView/components/left-nav/visualization-based-left-nav');
describe(FastPassLeftNav.displayName, () => {
    mockReactComponents([VisualizationBasedLeftNav]);
    let onRightPanelContentSwitch: () => void;
    let setNavComponentRef: (_) => void;
    let navLinkHandlerStub: NavLinkHandler;
    let deps: FastPassLeftNavDeps;
    let props: FastPassLeftNavProps;

    beforeEach(() => {
        onRightPanelContentSwitch = () => {};
        setNavComponentRef = _ => {};
        navLinkHandlerStub = {
            onFastPassTestClick: (e, link) => null,
        } as NavLinkHandler;
        deps = {
            getNavLinkHandler: () => navLinkHandlerStub,
        } as FastPassLeftNavDeps;
        props = {
            deps,
            selectedKey: 'some string',
            featureFlagStoreData: {},
            onRightPanelContentSwitch,
            setNavComponentRef,
        };
    });

    it('renders visualization based left nav with appropriate params', () => {
        const renderResult = render(<FastPassLeftNav {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([VisualizationBasedLeftNav]);
    });
});
