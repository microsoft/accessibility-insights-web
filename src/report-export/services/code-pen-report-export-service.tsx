// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    ReportExportFormProps,
    ReportExportService,
    ReportExportServiceKey,
} from 'report-export/types/report-export-service';

const codePenReportExportServiceKey: ReportExportServiceKey = 'codepen';

class CodePenExportForm extends React.Component<ReportExportFormProps> {
    private buttonRef: React.RefObject<HTMLButtonElement | null>; 

    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
    }

    public componentDidMount(): void {
        if (this.buttonRef.current) {
            this.buttonRef.current.click();
            this.props.onSubmit();
        }
    }

    public render(): JSX.Element {
        return (
            <form
                action="https://codepen.io/pen/define"
                method="POST"
                target="_blank"
                style={{ visibility: 'hidden' }}
            >
                <input
                    name="data"
                    type="hidden"
                    value={JSON.stringify({
                        title: this.props.htmlFileName,
                        description: this.props.description,
                        html: this.props.htmlExportData,
                        editors: '100', // collapse CSS and JS editors
                    })}
                />
                <button type="submit" ref={this.buttonRef} />
            </form>
        );
    }
}

export const CodePenReportExportService: ReportExportService = {
    key: codePenReportExportServiceKey,
    exportForm: CodePenExportForm,
    generateMenuItem: (onMenuItemClick, _, __) => {
        return {
            key: codePenReportExportServiceKey,
            name: 'to CodePen',
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                onMenuItemClick(e, codePenReportExportServiceKey);
            },
        };
    },
};
