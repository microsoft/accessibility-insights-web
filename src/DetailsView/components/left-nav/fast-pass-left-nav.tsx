// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { INav } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import { VisualizationType } from '../../../common/types/visualization-type';
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

    const tests = [VisualizationType.Issues, VisualizationType.TabStops];

    if (props.featureFlagStoreData[FeatureFlags.needsReview]) {
        tests.push(VisualizationType.NeedsReview);
    }

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
