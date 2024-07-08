// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContextualMenu, IButton, IRefObject } from '@fluentui/react';
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { StartOverContextMenuKeyOptions } from 'DetailsView/components/details-view-right-panel';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';

import {
    StartOverDropdown,
    StartOverProps,
} from '../../../../../DetailsView/components/start-over-dropdown';
jest.mock('@fluentui/react');
jest.mock('@fluentui/react-components');
jest.mock('common/components/controls/insights-command-button');

describe('StartOverDropdownTest', () => {
    mockReactComponents([Menu, MenuTrigger, MenuPopover, MenuList, MenuItem]);
    let defaultProps: StartOverProps;
    let openDialogMock: IMock<(dialogType: StartOverDialogType) => void>;

    beforeEach(() => {
        openDialogMock = Mock.ofInstance(() => null);
        defaultProps = {
            singleTestSuffix: 'single test suffix stub',
            allTestSuffix: 'all test suffix stub',
            rightPanelOptions: { showTest: true },
            switcherStartOverPreferences: { showTest: true },
            dropdownDirection: 'down',
            openDialog: openDialogMock.object,
            buttonRef: {} as IRefObject<IButton>,
            hasSubMenu: true
        };
    });

    it('render', () => {
        const renderResult = render(<StartOverDropdown {...defaultProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Menu, MenuTrigger, MenuPopover, MenuList, MenuItem]);
    });

    it('render ContextualMenu', async () => {
        useOriginalReactElements('@fluentui/react-components', ['Menu', 'MenuTrigger', 'MenuPopover', 'MenuList', 'MenuItem'])
        render(<StartOverDropdown {...defaultProps} />);

        const subMenu = screen.getByRole('menuitem');
        fireEvent.click(subMenu);

        const startAll = screen.getByText('Start over all test suffix stub');
        const startSingle = screen.getByText('Start over single test suffix stub');
        expect(startAll).toBeDefined();
        expect(startSingle).toBeDefined();
        // await act(() =>
        //     getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
        //         currentTarget: 'test event',
        //     }),
        // );
        // expect(renderResult.asFragment()).toMatchSnapshot();

        // const mockProps = getMockComponentClassPropsForCall(ContextualMenu);
        //expect(mockProps.target).toBe('test event');
    });

    const menuButtonOptions = [true, false];
    const optionName = 'showTest';
    const optionKey = 'test';
    menuButtonOptions.forEach(rightPanelOptionEnabled => {
        menuButtonOptions.forEach(switcherPreferencesOptionEnabled => {
            const rightPanelOptions = {
                [optionName]: rightPanelOptionEnabled,
            } as StartOverContextMenuKeyOptions;
            const switcherPreferences = {
                [optionName]: switcherPreferencesOptionEnabled,
            } as StartOverContextMenuKeyOptions;

            const shouldFindOption = rightPanelOptionEnabled && switcherPreferencesOptionEnabled;

            const casePrefix = shouldFindOption
                ? `${optionKey} item IS rendered`
                : `${optionKey} item IS NOT rendered`;

            // test(`${casePrefix} - rightPanelOptions.${optionName} is ${rightPanelOptionEnabled} & switcherStartOverPreferences.${optionName} is ${switcherPreferencesOptionEnabled}`, async () => {
            //     defaultProps.rightPanelOptions = rightPanelOptions;
            //     defaultProps.switcherStartOverPreferences = switcherPreferences;

            //     render(<StartOverDropdown {...defaultProps} />);
            //     await act(() =>
            //         getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
            //             currentTarget: 'test target',
            //         }),
            //     );

            //     const isStartOverOptionRendered = getMockComponentClassPropsForCall(
            //         ContextualMenu,
            //     ).items.some(item => item.key === optionKey);
            //     expect(isStartOverOptionRendered).toEqual(shouldFindOption);
            // });
        });
    });

    it('render with dropdown on left', async () => {
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };

        const renderResult = render(<StartOverDropdown {...props} />);
        const subMenu = screen.getByRole('menuitem');
        fireEvent.click(subMenu);
        // await act(() =>
        //     getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
        //         currentTarget: 'test target',
        //     }),
        // );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('should open the start test over dialog', async () => {
        useOriginalReactElements('@fluentui/react-components', ['MenuPopover', 'MenuList', 'MenuItem'])
        openDialogMock.setup(sds => sds('test')).verifiable(Times.once());


        const renderResult = render(<StartOverDropdown {...defaultProps} />);
        //console.log('test===>', getMockComponentClassPropsForCall(MenuuItem))
        //getMockComponentClassPropsForCall(MenuItem).onClick;
        // await act(() =>
        //     getMockComponentClassPropsForCall(MenuItem).onClick({
        //         currentTarget: 'test target',
        //     }),
        // );

        const subMenu = screen.getByRole('menuitem');
        fireEvent.click(subMenu);
        // const subMenuValue = screen.getByText('Start over all test suffix stub')
        // console.log('subMenuValue', subMenuValue)
        //fireEvent.click(subMenuValue);

        // await act(() =>
        //     getMockComponentClassPropsForCall(MenuItem).onClick({
        //         currentTarget: 'test target',
        //     }),
        // );


        // getMockComponentClassPropsForCall(MenuItem)
        //     .items.find(elem => elem.key === 'test')
        //     .onClick();


        // await act(() =>
        //     getMockComponentClassPropsForCall(MenuItem)?.onClick({})
        // );
        //console.log('here---->', getMockComponentClassPropsForCall(MenuItem))
        // const menuValue = screen.getByRole('menuitem');
        // fireEvent.click(menuValue);
        //
        // await act(() =>
        //     getMockComponentClassPropsForCall(Menu).onClick({
        //         currentTarget: 'test target',
        //     }),
        // );
        // await act(() =>
        //     getMockComponentClassPropsForCall(MenuItem)
        //         .items.find(elem => elem.key === 'test')
        //         .onClick()
        // );
        renderResult.debug();
        openDialogMock.verifyAll();
    });

    // it('should open the start assessment over dialog', async () => {
    //     openDialogMock.setup(sds => sds('assessment')).verifiable(Times.once());

    //     render(<StartOverDropdown {...defaultProps} />);
    //     await act(() =>
    //         getMockComponentClassPropsForCall(Menu).onClick({
    //             currentTarget: 'test target',
    //         }),
    //     );
    //     getMockComponentClassPropsForCall(ContextualMenu)
    //         .items.find(elem => elem.key === 'assessment')
    //         .onClick();

    //     openDialogMock.verifyAll();
    // });

    // it('should dismiss the contextMenu', async () => {
    //     const renderResult = render(<StartOverDropdown {...defaultProps} />);
    //     await act(() =>
    //         getMockComponentClassPropsForCall(Menu).onClick({
    //             currentTarget: 'test target',
    //         }),
    //     );
    //     await act(() => getMockComponentClassPropsForCall(ContextualMenu).onDismiss());
    //     const mockContextualmenu = renderResult.container.querySelector('mock-contextualmenu');
    //     expect(mockContextualmenu).toBeNull();
    // });
});
