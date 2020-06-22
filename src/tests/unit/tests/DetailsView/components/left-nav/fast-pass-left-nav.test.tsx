// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    FastPassLeftNav,
    FastPassLeftNavDeps,
    FastPassLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/fast-pass-left-nav';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';

describe(FastPassLeftNav, () => {
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
            navLinkHandler: navLinkHandlerStub,
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
        const actual = shallow(<FastPassLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    it('includes needs review test when feature flag on', () => {
        props.featureFlagStoreData[FeatureFlags.needsReview] = true;

        const actual = shallow(<FastPassLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
