// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TabStopRequirementState,
    VisualizationScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import {
    AutoDetectedFailuresDialog,
    AutoDetectedFailuresDialogProps,
} from 'DetailsView/components/auto-detected-failures-dialog';
import { shallow } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';

describe('AutoDetectedFailuresDialog', () => {
    let props: AutoDetectedFailuresDialogProps;
    let visualizationScanResultData: VisualizationScanResultData;
    const prevState = { autoDetectedFailuresDialogEnabled: false };
    const prevProps = {
        visualizationScanResultData: { tabStops: { tabbingCompleted: false } },
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
            tabStops: { tabbingCompleted: true, requirements },
        } as VisualizationScanResultData;
        props = {
            visualizationScanResultData,
        } as AutoDetectedFailuresDialogProps;
    });

    it('renders when dialog is not enabled', () => {
        const wrapper = shallow(<AutoDetectedFailuresDialog {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('on dialog enabled', () => {
        let wrapper;
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
    });
});
