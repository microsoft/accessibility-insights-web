// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
import * as React from 'react';
import {
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
            buttonRef: {} as any,
            hasSubMenu: false,
        };
    });

    it('renders CommandBarButtonsMenu', () => {
        const wrapper = render(<CommandBarButtonsMenu {...commandBarButtonsMenuProps} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    it('renders all child buttons with hasSubMenu false,', () => {
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
        const getMoreActionsButton = test.queryByRole('button');
        fireEvent.click(getMoreActionsButton);
        const hasExportButton = screen.getByText('Report export button');
        const hasSaveButton = screen.getByText('Save assessment button');
        const hasLoadButton = screen.getByText('Load assessment button');
        const hasTransferButton = screen.getByText('Transfer to assessment button');
        expect(hasExportButton).toMatchSnapshot('render export report menuitem');
        expect(hasSaveButton).toMatchSnapshot('render save assessment menuitem');
        expect(hasLoadButton).toMatchSnapshot('render load assessment menuitem');
        expect(hasTransferButton).toMatchSnapshot('render transfer to assessment menuitem');

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
