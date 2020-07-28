// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButtonsMenu,
    CommandBarButtonsMenuProps,
} from 'DetailsView/components/command-bar-buttons-menu';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { StartOverFactoryProps } from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import { IButton, IOverflowSetItemProps, RefObject } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { StartOverComponentFactory } from '../../../../../DetailsView/components/details-view-command-bar';

describe('CommandBarButtonsMenu', () => {
    let renderExportReportComponentMock: IMock<() => JSX.Element>;
    let startOverComponentFactory: IMock<StartOverComponentFactory>;
    let commandBarButtonsMenuProps: CommandBarButtonsMenuProps;

    beforeEach(() => {
        renderExportReportComponentMock = Mock.ofInstance(() => null);
        startOverComponentFactory = Mock.ofType<StartOverComponentFactory>();
        commandBarButtonsMenuProps = {
            switcherNavConfiguration: {
                StartOverComponentFactory: startOverComponentFactory.object,
            } as DetailsViewSwitcherNavConfiguration,
            renderExportReportButton: renderExportReportComponentMock.object,
            buttonRef: {} as RefObject<IButton>,
        } as CommandBarButtonsMenuProps;
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders child buttons', () => {
        renderExportReportComponentMock
            .setup(r => r())
            .returns(() => <>Report export button</>)
            .verifiable(Times.once());

        const startOverFactoryProps: StartOverFactoryProps = {
            ...commandBarButtonsMenuProps,
            dropdownDirection: 'left',
        };
        startOverComponentFactory
            .setup(s => s(startOverFactoryProps))
            .returns(() => <>Start over button</>)
            .verifiable(Times.once());

        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        const renderedProps = wrapper.getElement().props;
        const overflowItems: IOverflowSetItemProps[] = renderedProps.menuProps?.items;
        expect(overflowItems).toBeDefined();
        expect(overflowItems).toHaveLength(2);

        overflowItems.forEach(item => expect(item.onRender()).toMatchSnapshot());

        renderExportReportComponentMock.verifyAll();
        startOverComponentFactory.verifyAll();
    });
});
