// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { AutomatedChecksView, AutomatedChecksViewProps } from 'electron/views/automated-checks/automated-checks-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('AutomatedChecksView', () => {
    it('renders the automated checks view', () => {
        const props: AutomatedChecksViewProps = {
            deps: {
                deviceConnectActionCreator: null,
                currentWindow: null,
                windowStateActionCreator: null,
                scanActionCreator: Mock.ofType(ScanActionCreator).object,
            },
        } as AutomatedChecksViewProps;

        const wrapped = shallow(<AutomatedChecksView {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot('automated checks view');
    });

    it('triggers scan when first mounted', () => {
        const devicePort = 11111;

        const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
        scanActionCreatorMock.setup(creator => creator.scan(devicePort)).verifiable(Times.once());

        const props: AutomatedChecksViewProps = {
            deps: {
                scanActionCreator: scanActionCreatorMock.object,
            },
            devicePort,
        } as AutomatedChecksViewProps;

        const wrapped = shallow(<AutomatedChecksView {...props} />);

        scanActionCreatorMock.verifyAll();
    });
});
