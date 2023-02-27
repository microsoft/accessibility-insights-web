// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INav } from '@fluentui/react';
import * as React from 'react';

import { VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../../common/react/named-fc';
import { VisualizationType } from '../../../common/types/visualization-type';
import { BaseLeftNav, BaseLeftNavLink, onBaseLeftNavItemClick } from '../base-left-nav';
import {
    AssessmentLinkBuilderDeps,
    LeftNavLinkBuilder,
    OverviewLinkBuilderDeps,
} from './left-nav-link-builder';

export type VisualizationBasedLeftNavDeps = {
    leftNavLinkBuilder: LeftNavLinkBuilder;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
} & OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps;

export type VisualizationBasedLeftNavProps = {
    deps: VisualizationBasedLeftNavDeps;
    selectedKey: string;
    onLinkClick: onBaseLeftNavItemClick;
    visualizations: VisualizationType[];
    onRightPanelContentSwitch: () => void;
    setNavComponentRef: (nav: INav) => void;
};

export const VisualizationBasedLeftNav = NamedFC<VisualizationBasedLeftNavProps>(
    'VisualizationBasedLeftNav',
    props => {
        const {
            deps,
            selectedKey,
            onLinkClick,
            visualizations,
            onRightPanelContentSwitch,
            setNavComponentRef,
        } = props;

        const { leftNavLinkBuilder, visualizationConfigurationFactory } = deps;

        const links: BaseLeftNavLink[] = [];
        visualizations.forEach((visualizationType, index) => {
            const config = visualizationConfigurationFactory.getConfiguration(visualizationType);
            links.push(
                leftNavLinkBuilder.buildVisualizationConfigurationLink(
                    deps,
                    config,
                    onLinkClick,
                    visualizationType,
                    index + 1,
                    onRightPanelContentSwitch,
                ),
            );
        });

        return (
            <BaseLeftNav
                selectedKey={selectedKey}
                links={links}
                setNavComponentRef={setNavComponentRef}
            />
        );
    },
);
