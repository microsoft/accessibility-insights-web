// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButtonsMenu,
    CommandBarButtonsMenuProps,
} from 'DetailsView/components/command-bar-buttons-menu';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { StartOverFactoryProps } from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import { IOverflowSetItemProps } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    DetailsViewCommandBarProps,
    // tslint:disable-next-line: ordered-imports
    ReportExportComponentFactory,
    StartOverComponentFactory,
} from '../../../../../DetailsView/components/details-view-command-bar';

describe('CommandBarButtonsMenu', () => {
    let reportExportComponentFactory: IMock<ReportExportComponentFactory>;
    let startOverComponentFactory: IMock<StartOverComponentFactory>;
    let commandBarButtonsMenuProps: CommandBarButtonsMenuProps;

    beforeEach(() => {
        reportExportComponentFactory = Mock.ofType<ReportExportComponentFactory>();
        startOverComponentFactory = Mock.ofType<StartOverComponentFactory>();
        commandBarButtonsMenuProps = {
            switcherNavConfiguration: {
                ReportExportComponentFactory: reportExportComponentFactory.object,
                StartOverComponentFactory: startOverComponentFactory.object,
            } as DetailsViewSwitcherNavConfiguration,
        } as DetailsViewCommandBarProps;
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders child buttons', () => {
        reportExportComponentFactory
            .setup(r => r(commandBarButtonsMenuProps))
            .returns(() => <></>)
            .verifiable(Times.once());

        const startOverFactoryProps: StartOverFactoryProps = {
            ...commandBarButtonsMenuProps,
            dropdownDirection: 'left',
        };
        startOverComponentFactory
            .setup(s => s(startOverFactoryProps))
            .returns(() => <></>)
            .verifiable(Times.once());

        const wrapper = shallow(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        const renderedProps = wrapper.getElement().props;
        const overflowItems: IOverflowSetItemProps[] = renderedProps.menuProps?.items;
        expect(overflowItems).toBeDefined();
        expect(overflowItems).toHaveLength(2);

        overflowItems.forEach(item => item.onRender());

        reportExportComponentFactory.verifyAll();
        startOverComponentFactory.verifyAll();
    });
});
