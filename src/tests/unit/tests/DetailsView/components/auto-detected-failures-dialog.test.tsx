// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { fireEvent, render, RenderResult } from '@testing-library/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    TabStopRequirementState,
    VisualizationScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import {
    AutoDetectedFailuresDialog,
    AutoDetectedFailuresDialogProps,
} from 'DetailsView/components/auto-detected-failures-dialog';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import "@testing-library/jest-dom";

describe('AutoDetectedFailuresDialog', () => {

    let props: AutoDetectedFailuresDialogProps;
    let visualizationScanResultData: VisualizationScanResultData;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    const prevState = { autoDetectedFailuresDialogEnabled: false, isDisableBoxChecked: false };
    const prevProps: any = {
        visualizationScanResultData: {
            tabStops: { tabbingCompleted: false, needToCollectTabbingResults: true },
        },
    };

    beforeEach(() => {
        const requirements: TabStopRequirementState = {
            'input-focus': {
                instances: [
                    { id: 'test-id-1', description: 'test desc 1' },
                    { id: 'test-id-2', description: 'test desc 2' },
                ],
                status: 'fail',
                isExpanded: false,
            },
        };
        visualizationScanResultData = {
            tabStops: { tabbingCompleted: true, needToCollectTabbingResults: false, requirements },
        } as VisualizationScanResultData;
        userConfigurationStoreData = {
            showAutoDetectedFailuresDialog: true,
        } as UserConfigurationStoreData;

        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);

        props = {
            visualizationScanResultData,
            userConfigurationStoreData,
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
        } as AutoDetectedFailuresDialogProps;
    });

    it('renders when dialog is not enabled', () => {
        const wrapper = render(<AutoDetectedFailuresDialog {...props} />);

        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    describe('on dialog enabled', () => {
        let wrapper: RenderResult;

        beforeEach(() => {
            wrapper = render(<AutoDetectedFailuresDialog {...prevProps} {...prevState} />);
            wrapper.rerender(<AutoDetectedFailuresDialog {...props} />)
        });

        it('renders when dialog is enabled', () => {
            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it('is dismissed when "got it" button is clicked', () => {
            const gotItButton = wrapper.getAllByRole('button')

            fireEvent.click(gotItButton[0])

            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it('is dismissed when onDismiss is called', () => {
            const dismissButton = wrapper.getAllByRole('button')
            fireEvent.click(dismissButton[0])
            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it('box appears checked when "dont show again" box is clicked', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setAutoDetectedFailuresDialogState(true))
                .verifiable(Times.once());

            const checkBox = wrapper.getAllByRole('checkbox')
            fireEvent.click(checkBox[0], { target: { checked: true } })

            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it('nothing happens when checkbox change is undefined', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setAutoDetectedFailuresDialogState(true))
                .verifiable(Times.once());

            const checkBox = wrapper.getAllByRole('checkbox')
            fireEvent.click(checkBox[0], undefined)
            expect(wrapper.asFragment()).toMatchSnapshot();
        });
    });

    describe('on componentDidUpdate', () => {
        let wrapper: RenderResult;
        beforeEach(() => {
            wrapper = render(<AutoDetectedFailuresDialog {...prevProps} {...prevState} />);

        });
        it('displays dialog on tabbing completed', () => {
            const hasDialog = wrapper.container.querySelectorAll('.ms-Dialog-main');
            expect(hasDialog[0]).toBeFalsy();
            wrapper.rerender(<AutoDetectedFailuresDialog {...props} />)

            const newHasDialog = wrapper.container.querySelector('.ms-Dialog-main')

            expect(newHasDialog).toBeDefined();
        });

        it('does not display dialog with no results', () => {
            visualizationScanResultData.tabStops.requirements = null;

            const hasDialog = wrapper.container.querySelectorAll('.ms-Dialog-main');
            expect(hasDialog[0]).toBeFalsy();
            const newHasDialog = wrapper.container.querySelector('.ms-Dialog-main')
            expect(newHasDialog).toBeFalsy();
        });

        it('does not display dialog when dialog is disabled', () => {
            userConfigurationStoreData.showAutoDetectedFailuresDialog = false;

            const wrapper = render(<AutoDetectedFailuresDialog {...props} />);

            wrapper.rerender(<AutoDetectedFailuresDialog {...props} />)
            expect(wrapper.asFragment()).toMatchSnapshot();
        });
    });
});
