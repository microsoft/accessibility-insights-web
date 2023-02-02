// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContextualMenu, IButton, IRefObject } from '@fluentui/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { StartOverContextMenuKeyOptions } from 'DetailsView/components/details-view-right-panel';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import {
    StartOverDropdown,
    StartOverProps,
} from '../../../../../DetailsView/components/start-over-dropdown';

describe('StartOverDropdownTest', () => {
    let defaultProps: StartOverProps;
    let openDialogMock: IMock<(dialogType: StartOverDialogType) => void>;

    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;

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
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render ContextualMenu', () => {
        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
        expect(rendered.state().target).toBe(event.currentTarget);
    });

    const menuButtonOptions = [true, false];
    const startOverOptionsCases = [
        {
            key: 'assessment',
            optionName: 'showAssessment',
        },
        {
            key: 'test',
            optionName: 'showTest',
        },
    ];

    startOverOptionsCases.forEach(testCase => {
        const optionName = testCase.optionName;
        const optionKey = testCase.key;
        menuButtonOptions.forEach(rightPanelOptionEnabled => {
            menuButtonOptions.forEach(switcherPreferencesOptionEnabled => {
                const rightPanelOptions = {
                    [optionName]: rightPanelOptionEnabled,
                } as StartOverContextMenuKeyOptions;
                const switcherPreferences = {
                    [optionName]: switcherPreferencesOptionEnabled,
                } as StartOverContextMenuKeyOptions;

                const shouldFindOption =
                    rightPanelOptionEnabled && switcherPreferencesOptionEnabled;

                const casePrefix = shouldFindOption
                    ? `${optionKey} item IS rendered`
                    : `${optionKey} item IS NOT rendered`;

                test(`${casePrefix} - rightPanelOptions.${optionName} is ${rightPanelOptionEnabled} & switcherStartOverPreferences.${optionName} is ${switcherPreferencesOptionEnabled}`, () => {
                    defaultProps.rightPanelOptions = rightPanelOptions;
                    defaultProps.switcherStartOverPreferences = switcherPreferences;

                    const rendered = shallow<StartOverDropdown>(
                        <StartOverDropdown {...defaultProps} />,
                    );
                    rendered.find(InsightsCommandButton).simulate('click', event);
                    const isStartOverOptionRendered = rendered
                        .find(ContextualMenu)
                        .prop('items')
                        .some(item => item.key === optionKey);
                    expect(isStartOverOptionRendered).toEqual(shouldFindOption);
                });
            });
        });
    });

    it('render with dropdown on left', () => {
        const props: StartOverProps = {
            ...defaultProps,
            dropdownDirection: 'left',
        };
        const rendered = shallow(<StartOverDropdown {...props} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('should open the start test over dialog', () => {
        openDialogMock.setup(sds => sds('test')).verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();

        openDialogMock.verifyAll();
    });

    it('should open the start assessment over dialog', () => {
        openDialogMock.setup(sds => sds('assessment')).verifiable(Times.once());

        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();

        openDialogMock.verifyAll();
    });

    it('should dismiss the contextMenu', () => {
        const rendered = shallow<StartOverDropdown>(<StartOverDropdown {...defaultProps} />);
        rendered.find(InsightsCommandButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.state().isContextMenuVisible).toBe(false);
        expect(rendered.state().target).toBeNull();
    });
});
