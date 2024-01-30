// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Checkbox, Dialog, DialogFooter, PrimaryButton, Stack } from '@fluentui/react';
import { render, RenderResult } from '@testing-library/react';
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
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';
import '@testing-library/jest-dom';

jest.mock('@fluentui/react');

describe('AutoDetectedFailuresDialog', () => {
    mockReactComponents([Dialog, DialogFooter, Stack, Stack.Item, Checkbox, PrimaryButton]);
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
            wrapper.rerender(<AutoDetectedFailuresDialog {...props} />);
        });

        it('renders when dialog is enabled', () => {
            expect(wrapper.baseElement).toMatchSnapshot();
        });

        it('is dismissed when "got it" button is clicked', () => {
            useOriginalReactElements('@fluentui/react', ['PrimaryButton']);
            getMockComponentClassPropsForCall(PrimaryButton).onClick();

            expect(wrapper.baseElement).toMatchSnapshot();
        });

        it('is dismissed when onDismiss is called', () => {
            getMockComponentClassPropsForCall(Dialog).onDismiss();
            expect(wrapper.baseElement).toMatchSnapshot();
        });

        it('box appears checked when "dont show again" box is clicked', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setAutoDetectedFailuresDialogState(true))
                .verifiable(Times.once());

            useOriginalReactElements('@fluentui/react', ['Checkbox']);
            getMockComponentClassPropsForCall(Checkbox).onChange(undefined, true);

            expect(wrapper.baseElement).toMatchSnapshot();
        });

        it('nothing happens when checkbox change is undefined', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setAutoDetectedFailuresDialogState(true))
                .verifiable(Times.once());

            useOriginalReactElements('@fluentui/react', ['Checkbox']);
            getMockComponentClassPropsForCall(Checkbox).onChange(undefined);
            expect(wrapper.baseElement).toMatchSnapshot();
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
            wrapper.rerender(<AutoDetectedFailuresDialog {...props} />);

            const newHasDialog = wrapper.container.querySelector('.ms-Dialog-main');

            expect(newHasDialog).toBeDefined();
        });

        it('does not display dialog with no results', () => {
            visualizationScanResultData.tabStops.requirements = null;

            const hasDialog = wrapper.container.querySelectorAll('.ms-Dialog-main');
            expect(hasDialog[0]).toBeFalsy();
            const newHasDialog = wrapper.container.querySelector('.ms-Dialog-main');
            expect(newHasDialog).toBeFalsy();
        });

        it('does not display dialog when dialog is disabled', () => {
            userConfigurationStoreData.showAutoDetectedFailuresDialog = false;

            const wrapper = render(<AutoDetectedFailuresDialog {...props} />);

            wrapper.rerender(<AutoDetectedFailuresDialog {...props} />);
            expect(wrapper.baseElement).toMatchSnapshot();
        });
    });
});
