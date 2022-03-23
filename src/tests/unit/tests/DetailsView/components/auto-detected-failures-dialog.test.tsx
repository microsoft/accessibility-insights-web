// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Checkbox, Dialog, PrimaryButton } from '@fluentui/react';
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
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('AutoDetectedFailuresDialog', () => {
    let props: AutoDetectedFailuresDialogProps;
    let visualizationScanResultData: VisualizationScanResultData;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    const prevState = { autoDetectedFailuresDialogEnabled: false, isDisableBoxChecked: false };
    const prevProps = {
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
        const wrapper = shallow(<AutoDetectedFailuresDialog {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('on dialog enabled', () => {
        let wrapper: ShallowWrapper;

        beforeEach(() => {
            wrapper = shallow(<AutoDetectedFailuresDialog {...props} />);
            wrapper.instance().componentDidUpdate(prevProps, prevState);
        });

        it('renders when dialog is enabled', () => {
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('is dismissed when "got it" button is clicked', () => {
            wrapper.find(PrimaryButton).simulate('click');

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('is dismissed when onDismiss is called', () => {
            wrapper.find(Dialog).prop('onDismiss')();
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('box appears checked when "dont show again" box is clicked', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setAutoDetectedFailuresDialogState(true))
                .verifiable(Times.once());

            wrapper.find(Checkbox).simulate('change', undefined, true);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('nothing happens when checkbox change is undefined', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setAutoDetectedFailuresDialogState(true))
                .verifiable(Times.once());

            wrapper.find(Checkbox).simulate('change', undefined, undefined);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('on componentDidUpdate', () => {
        it('displays dialog on tabbing completed', () => {
            const wrapper = shallow(<AutoDetectedFailuresDialog {...props} />);
            expect(wrapper.state('dialogEnabled')).toBe(false);
            wrapper.instance().componentDidUpdate(prevProps, prevState);
            expect(wrapper.state('dialogEnabled')).toBe(true);
        });

        it('does not display dialog with no results', () => {
            visualizationScanResultData.tabStops.requirements = null;

            const wrapper = shallow(<AutoDetectedFailuresDialog {...props} />);
            expect(wrapper.state('dialogEnabled')).toBe(false);
            wrapper.instance().componentDidUpdate(prevProps, prevState);
            expect(wrapper.state('dialogEnabled')).toBe(false);
        });

        it('does not display dialog when dialog is disabled', () => {
            userConfigurationStoreData.showAutoDetectedFailuresDialog = false;

            const wrapper = shallow(<AutoDetectedFailuresDialog {...props} />);
            wrapper.instance().componentDidUpdate(prevProps, prevState);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
