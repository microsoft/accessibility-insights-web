// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import {
    getTransferToAssessmentButton,
    TransferToAssessmentButton,
    TransferToAssessmentButtonProps,
} from 'DetailsView/components/transfer-to-assessment-button';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('TransferToAssessmentButton', () => {
    let dataTransferViewControllerMock: IMock<DataTransferViewController>;
    let props: TransferToAssessmentButtonProps;

    beforeEach(() => {
        dataTransferViewControllerMock = Mock.ofType(DataTransferViewController);
        props = {
            deps: {
                dataTransferViewController: dataTransferViewControllerMock.object,
            },
        };
    });

    test('render', () => {
        const testSubject = shallow(<TransferToAssessmentButton {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
        expect(testSubject.find(InsightsCommandButton).prop('onClick')).toEqual(
            dataTransferViewControllerMock.object.showQuickAssessToAssessmentConfirmDialog,
        );
    });

    test('getTransferToAssessmentButton', () => {
        const testSubject = getTransferToAssessmentButton(props);
        expect(testSubject).toMatchSnapshot();
    });
});
