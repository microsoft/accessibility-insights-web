// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, Dialog, DialogFooter, PrimaryButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    QuickAssessToAssessmentDialog,
    QuickAssessToAssessmentDialogProps,
} from 'DetailsView/components/quick-assess-to-assessment-dialog';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    mockReactComponents,
    getMockComponentClassPropsForCall,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

describe('QuickAssessToAssessmentDialog', () => {
    mockReactComponents([DefaultButton, PrimaryButton, DialogFooter, Dialog]);

    let dataTransferViewControllerMock: IMock<DataTransferViewController>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let props: QuickAssessToAssessmentDialogProps;
    let afterDialogDismissedMock: IMock<() => void>;

    beforeEach(() => {
        dataTransferViewControllerMock = Mock.ofType(DataTransferViewController);
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        afterDialogDismissedMock = Mock.ofInstance(() => null);

        props = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                dataTransferViewController: dataTransferViewControllerMock.object,
            },
            afterDialogDismissed: afterDialogDismissedMock.object,
        } as QuickAssessToAssessmentDialogProps;
    });

    test('dialog is hidden when isShown is false', () => {
        props.isShown = false;
        const renderResult = render(<QuickAssessToAssessmentDialog {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('dialog is not hidden when isShown is true', () => {
        props.isShown = true;
        const renderResult = render(<QuickAssessToAssessmentDialog {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('onclick: cancel', async () => {
        props.isShown = true;

        render(<QuickAssessToAssessmentDialog {...props} />);

        await getMockComponentClassPropsForCall(DefaultButton).onClick();
        dataTransferViewControllerMock.verify(
            m => m.hideQuickAssessToAssessmentConfirmDialog(),
            Times.once(),
        );
    });

    test('onclick: continue to assessment', async () => {
        props.isShown = true;
        const eventStub = {} as SupportedMouseEvent;

        render(<QuickAssessToAssessmentDialog {...props} />);
        getMockComponentClassPropsForCall(PrimaryButton).onClick(eventStub);

        detailsViewActionMessageCreatorMock.verify(
            m => m.confirmDataTransferToAssessment(eventStub),
            Times.once(),
        );
        detailsViewActionMessageCreatorMock.verify(
            m => m.sendPivotItemClicked(DetailsViewPivotType[DetailsViewPivotType.assessment]),
            Times.once(),
        );
        detailsViewActionMessageCreatorMock.verify(
            m => m.changeRightContentPanel('Overview'),
            Times.once(),
        );
        dataTransferViewControllerMock.verify(
            m => m.hideQuickAssessToAssessmentConfirmDialog(),
            Times.once(),
        );
    });

    test('on dialog dismissed: call afterDialogDismissed', () => {
        render(<QuickAssessToAssessmentDialog {...props} />);
        getMockComponentClassPropsForCall(Dialog).modalProps.onDismissed();
        afterDialogDismissedMock.verify(m => m(), Times.once());
    });
});
