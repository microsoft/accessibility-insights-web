// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
} from '@fluentui/react-components';
import {
    ArrowClockwiseRegular,
    ChevronRightRegular,
    ChevronDownRegular,
} from '@fluentui/react-icons';
import { fireEvent, render } from '@testing-library/react';
import { StartOverContextMenuKeyOptions } from 'DetailsView/components/details-view-right-panel';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import { StartOverDropdown, StartOverProps } from 'DetailsView/components/start-over-dropdown';
import React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';

jest.mock('@fluentui/react');
jest.mock('@fluentui/react-components');
jest.mock('@fluentui/react-icons');
jest.mock('common/components/controls/insights-command-button');
jest.mock('DetailsView/components/start-over-dropdown-styles', () => {
    return {
        useStartOverDropdownStyles: jest.fn(),
    };
});
jest.mock('common/icons/fluentui-v9-icons');

describe('StartOverDropdownTest', () => {
    mockReactComponents([
        Menu,
        MenuTrigger,
        MenuItem,
        MenuButton,
        ArrowClockwiseRegular,
        ChevronRightRegular,
        ChevronDownRegular,
        MenuPopover,
        MenuList,
    ]);
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
            buttonRef: {} as React.RefObject<HTMLButtonElement>,
        };
    });

    it('render', () => {
        const renderResult = render(<StartOverDropdown {...defaultProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([MenuButton]);
    });

    it('render with dropdown on left', async () => {
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };

        const renderResult = render(<StartOverDropdown {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([MenuButton]);
    });
});

describe('StartOverDropdownTest user interaction', () => {
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
            buttonRef: {} as React.RefObject<HTMLButtonElement>,
        };
    });

    it('should open the start assessment over dialog', async () => {
        useOriginalReactElements('@fluentui/react-components', [
            'Menu',
            'MenuTrigger',
            'MenuButton',
            'MenuPopover',
            'MenuList',
            'MenuItem',
        ]);
        openDialogMock.setup(sds => sds('assessment')).verifiable(Times.once());

        const renderResult = render(<StartOverDropdown {...defaultProps} />);
        fireEvent.click(renderResult.getByRole('button'));
        getMockComponentClassPropsForCall(MenuList)
            .children.find(elem => elem.key === 'assessment')
            .props.onClick();

        openDialogMock.verifyAll();
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

            test(`${casePrefix} - rightPanelOptions.${optionName} is ${rightPanelOptionEnabled} & switcherStartOverPreferences.${optionName} is ${switcherPreferencesOptionEnabled}`, async () => {
                defaultProps.rightPanelOptions = rightPanelOptions;
                defaultProps.switcherStartOverPreferences = switcherPreferences;

                const renderResult = render(<StartOverDropdown {...defaultProps} />);
                fireEvent.click(renderResult.getByRole('button'));
                console.log(getMockComponentClassPropsForCall(MenuList));
                const isStartOverOptionRendered = getMockComponentClassPropsForCall(
                    MenuList,
                ).children.some(item => item.key === optionKey);
                expect(isStartOverOptionRendered).toEqual(shouldFindOption);
            });
        });
    });

    it('should open the start test over dialog', async () => {
        openDialogMock.setup(sds => sds('test')).verifiable(Times.once());

        const renderResult = render(<StartOverDropdown {...defaultProps} />);
        fireEvent.click(renderResult.getByRole('button'));
        getMockComponentClassPropsForCall(MenuList)
            .children.find(elem => elem.key === 'test')
            .props.onClick();

        openDialogMock.verifyAll();
    });
});
