// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButton,
    IButton,
    IOverflowSetItemProps,
    RefObject,
    TooltipHost,
} from '@fluentui/react';
import { render } from '@testing-library/react';
import {
    CommandBarButtonsMenu,
    CommandBarButtonsMenuProps,
} from 'DetailsView/components/command-bar-buttons-menu';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';

jest.mock('@fluentui/react');

describe('CommandBarButtonsMenu', () => {
    mockReactComponents([TooltipHost, CommandBarButton]);

    let renderExportReportComponentMock: IMock<() => JSX.Element>;
    let getStartOverMenuItemMock: IMock<() => StartOverMenuItem>;
    let commandBarButtonsMenuProps: CommandBarButtonsMenuProps;

    beforeEach(() => {
        renderExportReportComponentMock = Mock.ofInstance(() => null);
        getStartOverMenuItemMock = Mock.ofInstance(() => null);
        commandBarButtonsMenuProps = {
            renderExportReportButton: renderExportReportComponentMock.object,
            saveAssessmentButton: <>Save assessment button</>,
            loadAssessmentButton: <>Load assessment button</>,
            transferToAssessmentButton: <>Transfer to assessment button</>,

            getStartOverMenuItem: getStartOverMenuItemMock.object,
            buttonRef: {} as RefObject<IButton>,
        } as CommandBarButtonsMenuProps;
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = render(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        expectMockedComponentPropsToMatchSnapshots([CommandBarButton]);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    it('renders all child buttons,', () => {
        setupExportReportMenuItem();
        setupStartOverMenuItem();

        render(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        const commandBarProps = getMockComponentClassPropsForCall(CommandBarButton);

        const overflowItems: IOverflowSetItemProps[] = commandBarProps.menuProps?.items;

        expect(commandBarProps.menuProps?.items).toBeDefined();
        expect(commandBarProps.menuProps?.items).toHaveLength(5);

        expect(overflowItems[0].onRender()).toMatchSnapshot('render export report menuitem');
        expect(overflowItems[1].onRender()).toMatchSnapshot('render save assessment menuitem');
        expect(overflowItems[2].onRender()).toMatchSnapshot('render load assessment menuitem');
        expect(overflowItems[3].onRender()).toMatchSnapshot(
            'render transfer to assessment menuitem',
        );
        expect(overflowItems[4].onRender()).toMatchSnapshot('render start over menuitem');

        renderExportReportComponentMock.verifyAll();
        getStartOverMenuItemMock.verifyAll();
    });

    function setupExportReportMenuItem(): void {
        renderExportReportComponentMock
            .setup(r => r())
            .returns(() => <>Report export button</>)
            .verifiable(Times.once());
    }

    function setupStartOverMenuItem(): void {
        const startOverMenuItem = {
            onRender: () => <>Start over button</>,
        };
        getStartOverMenuItemMock
            .setup(s => s())
            .returns(() => startOverMenuItem)
            .verifiable(Times.once());
    }
});
