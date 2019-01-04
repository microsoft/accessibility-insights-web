// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { map } from 'lodash';
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { PivotConfiguration } from '../../../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../../../common/configs/visualization-configuration-factory';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../common/types/visualization-type';
import { NavLinkForLeftNav, LeftNavLinkOnClick } from '../details-view-left-nav';
import { TestViewLeftNavLink } from './test-view-left-nav-link';

export function getTestLinks(
    type: DetailsViewPivotType,
    pivotConfiguration: PivotConfiguration,
    visualizationConfigurationFactory: VisualizationConfigurationFactory,
    onClick: LeftNavLinkOnClick,
): INavLink[] {
    const data = pivotConfiguration.getTestsByType(type);

    const result = map(data, (visualization, index) => {
        const configuration = visualizationConfigurationFactory.getConfiguration(visualization);
        const displayableData = configuration.displayableData;

        const navLink: NavLinkForLeftNav = {
            name: displayableData ? displayableData.title : 'NO TITLE FOUND',
            key: VisualizationType[visualization],
            forceAnchor: true,
            url: '',
            index: index + 1,
            onRenderNavLink: (l, ri) => <TestViewLeftNavLink link={l} renderIcon={ri} />,
            iconProps: {
                className: 'hidden',
            },
            onClickNavLink: onClick,
        };

        return navLink;
    });

    return result;
}
