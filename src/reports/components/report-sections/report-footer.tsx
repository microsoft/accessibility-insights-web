// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export const ReportFooter = NamedFC('ReportFooter', ({ children }) => {
    return (
        <div className="report-footer-container">
            <div className="report-footer" role="contentinfo">
                {children}
            </div>
        </div>
    );
});
