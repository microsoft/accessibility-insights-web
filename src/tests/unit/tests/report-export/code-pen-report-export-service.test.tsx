// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/code-pen-report-export-service';
import { ReportExportFormProps } from 'report-export/types/report-export-service';
import { Mock, Times } from 'typemoq';

describe('CodePenReportExportService', () => {
    describe('exportForm', () => {
        let props: ReportExportFormProps;
        const ExportForm = CodePenReportExportService.exportForm;

        beforeEach(() => {
            props = {
                description: 'test-description',
                htmlFileName: 'test-html-filename',
                jsonFileName: 'test-json-filename',
                htmlExportData: 'test-html',
                jsonExportData: 'test-json',
                onSubmit: jest.fn(),
            };
        });

        it('renders', () => {
            const wrapped = render(<ExportForm {...props} />);
            const onMenuItemClick = jest.fn();
            wrapped.debug();
            CodePenReportExportService.generateMenuItem(
                onMenuItemClick,
                undefined,
                undefined,
            ).onClick();

            expect(wrapped.asFragment()).toMatchSnapshot();
        });

        it('submit the form right after the first render', () => {
            type OnSubmit = ReportExportFormProps['onSubmit'];
            HTMLFormElement.prototype.requestSubmit = jest.fn();
            const onSubmitMock = Mock.ofType<OnSubmit>();

            props.onSubmit = onSubmitMock.object;

            render(<ExportForm {...props} />);

            onSubmitMock.verify(onSubmit => onSubmit(), Times.once());
        });
    });
});
