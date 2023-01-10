// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    QuickAssessToAssessmentDialog,
    QuickAssessToAssessmentDialogProps,
} from 'DetailsView/components/quick-assess-to-assessment-dialog';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('QuickAssessToAssessmentDialog', () => {
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
        const testSubject = shallow(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('dialog is not hidden when isShown is true', () => {
        props.isShown = true;
        const testSubject = shallow(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('onclick: cancel', () => {
        props.isShown = true;

        const testSubject = shallow(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        const onClick = testSubject.find(DefaultButton).prop('onClick');
        onClick(null);

        dataTransferViewControllerMock.verify(
            m => m.hideQuickAssessToAssessmentConfirmDialog(),
            Times.once(),
        );
    });

    test('onclick: continue to assessment', () => {
        props.isShown = true;
        const eventStub = {} as SupportedMouseEvent;
        const testSubject = shallow(
            <QuickAssessToAssessmentDialog {...props}></QuickAssessToAssessmentDialog>,
        );
        const onClick = testSubject.find(PrimaryButton).prop('onClick');

        onClick(eventStub as any);

        detailsViewActionMessageCreatorMock.verify(
            m => m.confirmDataTransferToAssessment(eventStub),
            Times.once(),
        );
        detailsViewActionMessageCreatorMock.verify(
            m => m.sendPivotItemClicked(DetailsViewPivotType[DetailsViewPivotType.assessment]),
            Times.once(),
        );
        dataTransferViewControllerMock.verify(
            m => m.hideQuickAssessToAssessmentConfirmDialog(),
            Times.once(),
        );
    });
});
