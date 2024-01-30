// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
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
            const ref = React.createRef();
            // jest.spyOn(React, 'useRef').mockReturnValue(({ current: { click: jest.fn() } }))
            //jest.spyOn(ref.current, 'click').mockReturnValue({ click: jest.fn() })

            const wrapped = render(<ExportForm {...props} />);
            jest.spyOn(React, 'createRef').mockReturnValue({ current: screen.findAllByText('onSubmit') })

            expect(wrapped.asFragment()).toMatchSnapshot();
        });

        // it('submit the form right after the first render', () => {
        //     type OnSubmit = ReportExportFormProps['onSubmit'];
        //     const onSubmitMock = Mock.ofType<OnSubmit>();

        //     props.onSubmit = onSubmitMock.object;

        //     renderIntoDocument(<ExportForm {...props} />);

        //     onSubmitMock.verify(onSubmit => onSubmit(), Times.once());
        // });
    });
});
