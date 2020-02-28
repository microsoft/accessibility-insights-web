// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import {
    ExportFormat,
    ExportFormProps,
    ReportExportService,
} from 'report-export/types/report-export-service';

const CodePenReportExportServiceKey: ExportFormat = 'codepen';

const exportForm = NamedFC<ExportFormProps>(
    'CodePenReportExportForm',
    ({ fileName, description, html, onSubmit }) => {
        const buttonRef = React.useRef(null);

        React.useEffect(() => {
            if (buttonRef.current) {
                buttonRef.current.click();
                onSubmit();
            }
        }, [buttonRef, onSubmit]);

        return (
            <form
                action="https://codepen.io/pen/define"
                method="POST"
                target="_blank"
                rel="noopener"
                style={{ visibility: 'hidden' }}
            >
                <input
                    name="data"
                    type="hidden"
                    value={JSON.stringify({
                        title: fileName,
                        description,
                        html,
                        editors: '100', // collapse CSS and JS editors
                    })}
                />
                <button type="submit" ref={buttonRef} />
            </form>
        );
    },
);

export const CodePenReportExportService: ReportExportService = {
    key: CodePenReportExportServiceKey,
    displayName: 'CodePen',
    exportForm,
};
