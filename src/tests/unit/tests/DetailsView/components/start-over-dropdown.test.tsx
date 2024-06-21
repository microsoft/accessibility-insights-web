// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContextualMenu, IButton, IRefObject } from '@fluentui/react';
import { act, render } from '@testing-library/react';

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { StartOverContextMenuKeyOptions } from 'DetailsView/components/details-view-right-panel';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';

import {
    StartOverDropdown,
    StartOverProps,
} from '../../../../../DetailsView/components/start-over-dropdown';
jest.mock('@fluentui/react');
jest.mock('common/components/controls/insights-command-button');

describe('StartOverDropdownTest', () => {
    mockReactComponents([ContextualMenu, InsightsCommandButton]);
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
        };
    });

    it('render', () => {
        const renderResult = render(<StartOverDropdown {...defaultProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ContextualMenu, InsightsCommandButton]);
    });

    it('render ContextualMenu', async () => {
        const renderResult = render(<StartOverDropdown {...defaultProps} />);

        await act(() =>
            getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
                currentTarget: 'test event',
            }),
        );
        expect(renderResult.asFragment()).toMatchSnapshot();

        const mockProps = getMockComponentClassPropsForCall(ContextualMenu);
        expect(mockProps.target).toBe('test event');
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

                render(<StartOverDropdown {...defaultProps} />);
                await act(() =>
                    getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
                        currentTarget: 'test target',
                    }),
                );

                const isStartOverOptionRendered = getMockComponentClassPropsForCall(
                    ContextualMenu,
                ).items.some(item => item.key === optionKey);
                expect(isStartOverOptionRendered).toEqual(shouldFindOption);
            });
        });
    });

    it('render with dropdown on left', async () => {
        mockReactComponents([InsightsCommandButton]);
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };

        const renderResult = render(<StartOverDropdown {...props} />);
        await act(() =>
            getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
                currentTarget: 'test target',
            }),
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('should open the start test over dialog', async () => {
        openDialogMock.setup(sds => sds('test')).verifiable(Times.once());

        render(<StartOverDropdown {...defaultProps} />);
        await act(() =>
            getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
                currentTarget: 'test target',
            }),
        );
        getMockComponentClassPropsForCall(ContextualMenu)
            .items.find(elem => elem.key === 'test')
            .onClick();

        openDialogMock.verifyAll();
    });

    it('should open the start assessment over dialog', async () => {
        openDialogMock.setup(sds => sds('assessment')).verifiable(Times.once());

        render(<StartOverDropdown {...defaultProps} />);
        await act(() =>
            getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
                currentTarget: 'test target',
            }),
        );
        getMockComponentClassPropsForCall(ContextualMenu)
            .items.find(elem => elem.key === 'assessment')
            .onClick();

        openDialogMock.verifyAll();
    });

    it('should dismiss the contextMenu', async () => {
        const renderResult = render(<StartOverDropdown {...defaultProps} />);
        await act(() =>
            getMockComponentClassPropsForCall(InsightsCommandButton).onClick({
                currentTarget: 'test target',
            }),
        );
        await act(() => getMockComponentClassPropsForCall(ContextualMenu).onDismiss());
        const mockContextualmenu = renderResult.container.querySelector('mock-contextualmenu');
        expect(mockContextualmenu).toBeNull();
    });
});
