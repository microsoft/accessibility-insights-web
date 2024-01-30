// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, PrimaryButton, Dialog, DialogFooter } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    QuickAssessToAssessmentDialog,
    QuickAssessToAssessmentDialogProps,
} from 'DetailsView/components/quick-assess-to-assessment-dialog';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';
import { It, IMock, Mock, Times } from 'typemoq';
import {
    mockReactComponents,
    useOriginalReactElements,
    getMockComponentClassPropsForCall,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('QuickAssessToAssessmentDialog', () => {
    mockReactComponents([DefaultButton, PrimaryButton, DialogFooter, Dialog]);

    let dataTransferViewControllerMock: IMock<DataTransferViewController>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let props: QuickAssessToAssessmentDialogProps;

    beforeEach(() => {
        dataTransferViewControllerMock = Mock.ofType(DataTransferViewController);
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        props = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                dataTransferViewController: dataTransferViewControllerMock.object,
            },
        } as QuickAssessToAssessmentDialogProps;
    });

    test('dialog is hidden when isShown is false', () => {
        props.isShown = false;
        const renderResult = render(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('dialog is not hidden when isShown is true', () => {
        props.isShown = true;
        const renderResult = render(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('onclick: cancel', async () => {
        props.isShown = true;

        const renderResult = render(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );

        getMockComponentClassPropsForCall(DefaultButton).onClick();
        dataTransferViewControllerMock.verify(
            m => m.hideQuickAssessToAssessmentConfirmDialog(),
            Times.once(),
        );
    });

    test('onclick: continue to assessment', async () => {
        props.isShown = true;

        const renderResult = render(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        getMockComponentClassPropsForCall(PrimaryButton).onClick();

        detailsViewActionMessageCreatorMock.verify(
            m => m.confirmDataTransferToAssessment(It.isAny()),
            Times.once(),
        );
        detailsViewActionMessageCreatorMock.verify(
            m => m.sendPivotItemClicked(It.isAny()),
            Times.once(),
        );
        detailsViewActionMessageCreatorMock.verify(
            m => m.changeRightContentPanel(It.isAny()),
            Times.once(),
        );
        dataTransferViewControllerMock.verify(
            m => m.hideQuickAssessToAssessmentConfirmDialog(),
            Times.once(),
        );
    });
});
