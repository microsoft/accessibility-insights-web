// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { Mock } from 'typemoq';

import { PivotConfiguration } from '../../../../../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import {
    AllTestLeftNav,
    AllTestLeftNavDeps,
    AllTestLeftNavProps,
} from '../../../../../DetailsView/components/left-nav/all-test-left-nav';
import { NavLinkHandler } from '../../../../../DetailsView/components/left-nav/nav-link-handler';

describe('AllTestExperienceLeftNavTest', () => {
    test('render', () => {
        const deps: AllTestLeftNavDeps = {
            pivotConfiguration: Mock.ofType(PivotConfiguration).object,
            visualizationConfigurationFactory: Mock.ofType(VisualizationConfigurationFactory).object,
            navLinkHandler: {} as NavLinkHandler,
        };

        const props: AllTestLeftNavProps = {
            deps,
            selectedPivot: DetailsViewPivotType.fastPass,
            selectedDetailsView: -1 as VisualizationType,
            renderNav: () => (<div>nav</div>),
            onPivotItemClick: Mock.ofInstance((item, event) => {}).object,
        };

        const rendered = shallow(<AllTestLeftNav {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('render pivot item', () => {
        const deps: AllTestLeftNavDeps = {
            pivotConfiguration: Mock.ofType(PivotConfiguration).object,
            visualizationConfigurationFactory: Mock.ofType(VisualizationConfigurationFactory).object,
            navLinkHandler: {} as NavLinkHandler,
        };

        const props: AllTestLeftNavProps = {
            deps,
            selectedPivot: DetailsViewPivotType.fastPass,
            selectedDetailsView: -1 as VisualizationType,
            renderNav: () => (<div>nav</div>),
            onPivotItemClick: Mock.ofInstance((item, event) => {}).object,
        };

        const rendered = shallow(<AllTestLeftNav {...props} />);
        const fastPassPivotItem = rendered.find(PivotItem).at(0);
        const itemProps = {
            itemIcon: 'item-icon-test',
            headerText: 'header-text-test',
        };

        expect(fastPassPivotItem.prop('onRenderItemLink')(itemProps)).toMatchSnapshot();
    });
});
