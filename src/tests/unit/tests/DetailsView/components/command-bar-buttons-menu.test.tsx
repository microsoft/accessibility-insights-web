// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommandBarButton, IButton, IOverflowSetItemProps, RefObject } from '@fluentui/react';
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Tooltip,
} from '@fluentui/react-components';
import { fireEvent, render, screen } from '@testing-library/react';
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
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';

jest.mock('@fluentui/react-components');
jest.mock('common/icons/fluentui-v9-icons');

describe('CommandBarButtonsMenu', () => {
    mockReactComponents([Tooltip, Menu, MenuTrigger, MenuButton, MenuPopover, MenuList, MenuItem]);

    let renderExportReportComponentMock: IMock<() => JSX.Element>;
    let getStartOverMenuItemMock: any;
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
            buttonRef: {
                current: {},
            },
            hasSubMenu: false,
        };
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = render(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        //expectMockedComponentPropsToMatchSnapshots([Menu]);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    it('renders all child buttons with hasSubMenu false,', () => {
        //useOriginalReactElements('@fluentui/react', ['TooltipHost']);
        useOriginalReactElements('@fluentui/react-components', [
            'Menu',
            'MenuButton',
            'MenuTrigger',
            'MenuPopover',
            'MenuList',
            'MenuItem',
            'Tooltip',
        ]);
        setupExportReportMenuItem();
        setupStartOverMenuItem();

        const test = render(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        test.debug();
        const getMoreActionsButton = test.queryByRole('button');
        fireEvent.click(getMoreActionsButton);
        //test.debug();
        const hasExportButton = screen.getByText('Report export button');
        const hasSaveButton = screen.getByText('Save assessment button');
        const hasLoadButton = screen.getByText('Load assessment button');
        //const hasStartOver = screen.getByText('Start over button');
        const hasTransferButton = screen.getByText('Transfer to assessment button');
        expect(hasExportButton).toMatchSnapshot('render export report menuitem');
        expect(hasSaveButton).toMatchSnapshot('render save assessment menuitem');
        expect(hasLoadButton).toMatchSnapshot('render load assessment menuitem');
        expect(hasTransferButton).toMatchSnapshot('render transfer to assessment menuitem');
        // expect(hasStartOver).toMatchSnapshot('render start over button menuitem');
        //old
        //expect(overflowItems[4].onRender()).toMatchSnapshot('render start over menuitem');
        // expect(menuListValues[0])
        //menuListValues.debug();

        // expect(menuListValues).toMatchSnapshot('render export report menuitem')

        //const commandBarProps = getMockComponentClassPropsForCall(CommandBarButton);

        // const overflowItems: IOverflowSetItemProps[] = commandBarProps?.menuProps?.items;

        // expect(commandBarProps?.menuProps?.items).toBeDefined();
        // expect(commandBarProps?.menuProps?.items).toHaveLength(5);

        // expect(overflowItems[0].onRender()).toMatchSnapshot('render export report menuitem');
        // expect(overflowItems[1].onRender()).toMatchSnapshot('render save assessment menuitem');
        // expect(overflowItems[2].onRender()).toMatchSnapshot('render load assessment menuitem');
        // expect(overflowItems[3].onRender()).toMatchSnapshot(
        //     'render transfer to assessment menuitem',
        // );
        // expect(overflowItems[4].onRender()).toMatchSnapshot('render start over menuitem');

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
            children: <>Start over button</>,
        };
        getStartOverMenuItemMock
            .setup(s => s())
            .returns(() => startOverMenuItem.children)
            .verifiable(Times.once());
    }
});
