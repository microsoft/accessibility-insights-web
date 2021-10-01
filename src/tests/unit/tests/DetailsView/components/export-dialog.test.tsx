// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { shallow } from 'enzyme';
import { Dialog, PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import { ReportExportService } from 'report-export/types/report-export-service';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { FileURLProvider } from '../../../../../common/file-url-provider';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    ExportDialog,
    ExportDialogProps,
} from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const detailsViewActionMessageCreatorMock = Mock.ofType(
        DetailsViewActionMessageCreator,
        MockBehavior.Strict,
    );
    const fileProviderMock = Mock.ofType<FileURLProvider>();
    const reportExportServiceProvider = Mock.ofType<ReportExportServiceProvider>();
    const eventStub = 'event stub' as any;
    const onExportClickMock = Mock.ofInstance(() => {});
    const afterDismissedMock = Mock.ofInstance(() => null);
    const reportExportServiceStub = {
        key: 'html',
        generateMenuItem: () => null,
        exportForm: CodePenReportExportService.exportForm,
    } as ReportExportService;
    let props: ExportDialogProps;

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        detailsViewActionMessageCreatorMock.reset();
        onExportClickMock.reset();
        fileProviderMock.reset();
        reportExportServiceProvider.reset();

        const deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            fileURLProvider: fileProviderMock.object,
            reportExportServiceProvider: reportExportServiceProvider.object,
        };

        props = {
            deps,
            isOpen: false,
            html: 'fake html',
            fileName: 'THE REPORT FILE NAME',
            description: 'description',
            onClose: onCloseMock.object,
            onDescriptionChange: onDescriptionChangeMock.object,
            reportExportFormat: 'Assessment',
            onExportClick: onExportClickMock.object,
            featureFlagStoreData: {},
            afterDismissed: afterDismissedMock.object,
        };
    });

    describe('renders', () => {
        const isOpenOptions = [true, false];

        it.each(isOpenOptions)('with open %p', isOpen => {
            props.isOpen = isOpen;
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            const wrapper = shallow(<ExportDialog {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });

        it('with export dropdown', () => {
            props.featureFlagStoreData[FeatureFlags.exportReportOptions] = true;
            props.featureFlagStoreData[FeatureFlags.exportReportJSON] = true;
            detailsViewActionMessageCreatorMock
                .setup(a => a.exportResultsClicked(props.reportExportFormat, props.html, eventStub))
                .verifiable(Times.once());
            reportExportServiceProvider
                .setup(p => p.forKey(It.isAny()))
                .returns(() => reportExportServiceStub);
            props.isOpen = true;
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            const wrapper = shallow(<ExportDialog {...props} />);
            const elem = wrapper.debug();
            expect(elem).toMatchSnapshot();

            fileProviderMock.verifyAll();
        });

        it('with CodePen export form', () => {
            const formProps = {
                html: props.html,
                fileName: props.fileName,
                description: props.description,
                onSubmit: jest.fn(),
            };

            const wrapped = shallow(<CodePenReportExportService.exportForm {...formProps} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            onExportClickMock.setup(getter => getter()).verifiable(Times.never());
            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });

        it('handles click on export button', () => {
            const unchangedDescription = 'description';
            onDescriptionChangeMock
                .setup(dc => dc(It.isValue(unchangedDescription)))
                .verifiable(Times.once());

            onCloseMock.setup(oc => oc()).verifiable(Times.once());
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.exactly(2));
            onExportClickMock.setup(getter => getter()).verifiable(Times.once());

            detailsViewActionMessageCreatorMock
                .setup(a => a.exportResultsClicked(props.reportExportFormat, props.html, eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const flaggedComponent = wrapper.find(PrimaryButton);

            flaggedComponent.simulate('click', eventStub);

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            fileProviderMock
                .setup(provider => provider.provideURL(It.isAny(), It.isAnyString()))
                .returns(() => 'fake-url')
                .verifiable(Times.once());
            const changedDescription = 'changed-description';
            onDescriptionChangeMock
                .setup(handler => handler(It.isValue(changedDescription)))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            fileProviderMock.verifyAll();
            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            detailsViewActionMessageCreatorMock.verifyAll();
            onExportClickMock.verifyAll();
        });
    });
});
