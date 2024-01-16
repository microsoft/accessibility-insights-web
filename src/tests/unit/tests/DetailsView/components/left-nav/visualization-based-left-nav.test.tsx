// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { VisualizationConfiguration } from '../../../../../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../../../../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import {
    BaseLeftNav,
    BaseLeftNavLink,
    onBaseLeftNavItemClick,
} from '../../../../../../DetailsView/components/base-left-nav';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import {
    VisualizationBasedLeftNav,
    VisualizationBasedLeftNavDeps,
    VisualizationBasedLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/visualization-based-left-nav';
import { NavLinkButton } from '../../../../../../DetailsView/components/nav-link-button';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../DetailsView/components/base-left-nav');
jest.mock('../../../../../../DetailsView/components/nav-link-button');
describe('VisualizationBasedLeftNav', () => {
    mockReactComponents([NavLinkButton, BaseLeftNav]);
    let linkStub: BaseLeftNavLink;
    let deps: VisualizationBasedLeftNavDeps;
    let props: VisualizationBasedLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let onLinkClickStub: onBaseLeftNavItemClick;
    let visualizationsStub: VisualizationType[];
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let configStub: VisualizationConfiguration;
    let onRightPanelContentSwitch: () => void;
    let setNavComponentRef: (nav) => void;

    beforeEach(() => {
        visualizationsStub = [-1, -2];
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder);
        configFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        onLinkClickStub = (event, item) => null;
        linkStub = {} as BaseLeftNavLink;
        configStub = {} as VisualizationConfiguration;
        onRightPanelContentSwitch = () => {};
        setNavComponentRef = _ => {};

        deps = {
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            visualizationConfigurationFactory: configFactoryMock.object,
        } as VisualizationBasedLeftNavDeps;

        props = {
            deps,
            selectedKey: 'some key',
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            onLinkClick: onLinkClickStub,
            visualizations: visualizationsStub,
            onRightPanelContentSwitch,
            setNavComponentRef,
        };

        visualizationsStub.forEach((visualizationType, index) => {
            configFactoryMock
                .setup(cfm => cfm.getConfiguration(visualizationType))
                .returns(() => configStub);

            leftNavLinkBuilderMock
                .setup(lnlbm =>
                    lnlbm.buildVisualizationConfigurationLink(
                        deps,
                        configStub,
                        onLinkClickStub,
                        visualizationType,
                        index + 1,
                        onRightPanelContentSwitch,
                    ),
                )
                .returns(() => linkStub);
        });
    });

    it('renders with index icon', () => {
        const renderResult = render(<VisualizationBasedLeftNav {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([BaseLeftNav]);
    });
});
