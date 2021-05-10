// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import { INav } from 'office-ui-fabric-react';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { NavLinkHandler } from './nav-link-handler';
import {
    VisualizationBasedLeftNav,
    VisualizationBasedLeftNavDeps,
} from './visualization-based-left-nav';

export type FastPassLeftNavDeps = {
    navLinkHandler: NavLinkHandler;
} & VisualizationBasedLeftNavDeps;
export type FastPassLeftNavProps = {
    deps: FastPassLeftNavDeps;
    selectedKey: string;
    featureFlagStoreData: FeatureFlagStoreData;
    onRightPanelContentSwitch: () => void;
    setNavComponentRef: (nav: INav) => void;
};

export const FastPassLeftNav = NamedFC<FastPassLeftNavProps>('FastPassLeftNav', props => {
    const { deps, setNavComponentRef } = props;

    const { navLinkHandler } = deps;

    const fastPassProvider = createFastPassProviderWithFeatureFlags(props.featureFlagStoreData);
    const tests = fastPassProvider.getAllFastPassVisualizations();

    return (
        <VisualizationBasedLeftNav
            {...props}
            onLinkClick={navLinkHandler.onFastPassTestClick}
            visualizations={tests}
            onRightPanelContentSwitch={props.onRightPanelContentSwitch}
            setNavComponentRef={setNavComponentRef}
        />
    );
});
