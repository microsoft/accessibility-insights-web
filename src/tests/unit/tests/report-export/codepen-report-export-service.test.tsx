// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { CodePenReportExportService } from 'report-export/services/codepen-report-export-service';
import { ExportFormProps } from 'report-export/types/report-export-service';
import { Mock, Times } from 'typemoq';

describe('CodePenReportExportService', () => {
    describe('exportForm', () => {
        let props: ExportFormProps;
        const ExportForm = CodePenReportExportService.exportForm;

        beforeEach(() => {
            props = {
                description: 'test-description',
                fileName: 'test-filename',
                html: 'test-html',
                onSubmit: null,
            };
        });

        it('renders', () => {
            const wrapped = shallow(<ExportForm {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('submit the form right after the first render', () => {
            type OnSubmit = ExportFormProps['onSubmit'];
            const onSubmitMock = Mock.ofType<OnSubmit>();

            props.onSubmit = onSubmitMock.object;

            mount(<ExportForm {...props} />);

            onSubmitMock.verify(onSubmit => onSubmit(), Times.once());
        });
    });
});
