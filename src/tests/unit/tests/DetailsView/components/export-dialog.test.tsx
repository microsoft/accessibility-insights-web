// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { ExportDialog, ExportDialogProps } from '../../../../../DetailsView/components/export-dialog';
import { ReportNameGenerator } from '../../../../../DetailsView/reports/report-name-generator';

describe('ExportDialog', () => {
    let onCloseMock: IMock<() => void>;
    let onDescriptionChangeMock: IMock<(value: string) => void>;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    const eventStub = 'event stub' as any;
    let props: ExportDialogProps;
    let testSubject: ExportDialog;

    beforeEach(() => {
        onCloseMock = Mock.ofInstance(() => {});
        onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);

        const deps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
        };

        props = {
            deps,
            isOpen: false,
            html: '<html><body>test-html</body></html>',
            fileName: 'THE REPORT FILE NAME',
            description: 'description',
            onClose: onCloseMock.object,
            onDescriptionChange: onDescriptionChangeMock.object,
            actionMessageCreator: actionMessageCreatorMock.object,
            exportResultsType: 'Assessment',
        };

        testSubject = new ExportDialog(props);
    });

    test('renders as shown when open', () => {
        testRender(true);
    });

    test('renders as hidden when not open', () => {
        testRender(false);
    });

    test('onDismiss calls props.onClose', () => {
        onCloseMock.setup(oc => oc()).verifiable(Times.once());

        invokeHandler('onDismiss', [eventStub]);

        onCloseMock.verifyAll();
        onDescriptionChangeMock.verifyAll();
        actionMessageCreatorMock.verifyAll();
    });

    test('onExportLinkClick calls props.onClose & sends telemetry', () => {
        onCloseMock.setup(oc => oc()).verifiable(Times.once());

        actionMessageCreatorMock
            .setup(a => a.exportResultsClicked(props.exportResultsType, props.html, eventStub))
            .verifiable(Times.once());

        invokeHandler('onExportLinkClick', [eventStub]);

        onCloseMock.verifyAll();
        onDescriptionChangeMock.verifyAll();
        actionMessageCreatorMock.verifyAll();
    });

    test('onDescriptionChanged calls props.onDescriptionChange', () => {
        const changedDescription = 'changed-description';
        onDescriptionChangeMock.setup(odc => odc(changedDescription)).verifiable(Times.once());

        invokeHandler('onDescriptionChange', [null, changedDescription]);

        onCloseMock.verifyAll();
        onDescriptionChangeMock.verifyAll();
        actionMessageCreatorMock.verifyAll();
    });

    function invokeHandler(handlerName: string, parameter: any): void {
        (testSubject as any)[handlerName](...parameter);
    }

    function testRender(isDialogOpen: boolean): void {
        props.isOpen = isDialogOpen;

        const actual = testSubject.render();

        expect(actual.props.hidden).toBe(!isDialogOpen);
        expect(actual).toMatchSnapshot();
    }
});
