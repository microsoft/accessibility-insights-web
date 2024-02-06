// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import {
    getTransferToAssessmentButton,
    TransferToAssessmentButton,
    TransferToAssessmentButtonProps,
} from 'DetailsView/components/transfer-to-assessment-button';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('common/components/controls/insights-command-button');
describe('TransferToAssessmentButton', () => {
    mockReactComponents([InsightsCommandButton]);
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
        const renderResult = render(<TransferToAssessmentButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([InsightsCommandButton]);
        expect(getMockComponentClassPropsForCall(InsightsCommandButton).onClick).toEqual(
            dataTransferViewControllerMock.object.showQuickAssessToAssessmentConfirmDialog,
        );
    });

    test('getTransferToAssessmentButton', () => {
        const testSubject = getTransferToAssessmentButton(props);
        expect(testSubject).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([InsightsCommandButton]);
    });
});
