// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, ContextualMenu, IButton, IRefObject } from '@fluentui/react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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
            rightPanelOptions: { showAssessment: true, showTest: true },
            switcherStartOverPreferences: { showAssessment: true, showTest: true },
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
        useOriginalReactElements('common/components/controls/insights-command-button', [
            'InsightsCommandButton',
        ]);

        const renderResult = render(<StartOverDropdown {...defaultProps} />);

        await userEvent.click(renderResult.getByRole('button'));

        expect(renderResult.asFragment()).toMatchSnapshot();

        const mockProps = getMockComponentClassPropsForCall(ContextualMenu);
        expect(mockProps.target).not.toBeNull();
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
                await userEvent.click(renderResult.getByRole('button'));
                const isStartOverOptionRendered = getMockComponentClassPropsForCall(
                    ContextualMenu,
                ).items.some(item => item.key === optionKey);
                expect(isStartOverOptionRendered).toEqual(shouldFindOption);
            });
        });
    });

    it('render with dropdown on left', async () => {
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };

        const renderResult = render(<StartOverDropdown {...props} />);
        await userEvent.click(renderResult.getByRole('button'));
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('should open the start test over dialog', async () => {
        openDialogMock.setup(sds => sds('test')).verifiable(Times.once());

        const renderResult = render(<StartOverDropdown {...defaultProps} />);
        await userEvent.click(renderResult.getByRole('button'));
        getMockComponentClassPropsForCall(ContextualMenu)
            .items.find(elem => elem.key === 'test')
            .onClick();

        openDialogMock.verifyAll();
    });

    it('should open the start assessment over dialog', async () => {
        openDialogMock.setup(sds => sds('assessment')).verifiable(Times.once());

        const renderResult = render(<StartOverDropdown {...defaultProps} />);
        await userEvent.click(renderResult.getByRole('button'));
        getMockComponentClassPropsForCall(ContextualMenu)
            .items.find(elem => elem.key === 'assessment')
            .onClick();

        openDialogMock.verifyAll();
    });

    it('should dismiss the contextMenu', async () => {
        const renderResult = render(<StartOverDropdown {...defaultProps} />);

        await userEvent.click(renderResult.getByRole('button'));
        getMockComponentClassPropsForCall(ContextualMenu).onDismiss();
        const mockContextualmenu = renderResult.container.querySelector('mock-contextual-menu');
        expect(mockContextualmenu).toBeNull();
    });
});
