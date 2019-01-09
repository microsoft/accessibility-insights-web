import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import {
    IVisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { BaseLeftNavLink, onBaseLeftNavItemClick } from '../../../../../../DetailsView/components/base-left-nav';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import {
    VisualizationBasedLeftNav,
    VisualizationBasedLeftNavDeps,
    VisualizationBasedLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/visualization-based-left-nav';

describe('VisualizationBasedLeftNav', () => {
    let linkStub: BaseLeftNavLink;
    let deps: VisualizationBasedLeftNavDeps;
    let props: VisualizationBasedLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let onLinkClickStub: onBaseLeftNavItemClick;
    let visualizationsStub: VisualizationType[];
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let configStub: IVisualizationConfiguration;

    beforeEach(() => {
        visualizationsStub = [-1, -2];
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder, MockBehavior.Strict);
        configFactoryMock = Mock.ofType(VisualizationConfigurationFactory, MockBehavior.Strict);
        onLinkClickStub = (event, item) => null;
        linkStub = {} as BaseLeftNavLink;
        configStub = {} as IVisualizationConfiguration;

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
        };

        visualizationsStub.forEach((type, index) => {
            configFactoryMock
                .setup(cfm => cfm.getConfiguration(type))
                .returns(() => configStub);

            leftNavLinkBuilderMock
                .setup(lnlbm => lnlbm.buildVisualizationConfigurationLink(configStub, onLinkClickStub, type, index + 1))
                .returns(() => linkStub);
        });
    });

    it('renders with index icon', () => {
        const actual = shallow(<VisualizationBasedLeftNav {...props} />);
        const renderIcon: (link: BaseLeftNavLink) => JSX.Element = actual.prop('renderIcon');
        const renderedIcon = shallow(renderIcon(linkStub));

        expect(actual.getElement()).toMatchSnapshot();
        expect(renderedIcon.getElement()).toMatchSnapshot();
    });
});
