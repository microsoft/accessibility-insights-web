// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { SectionProps } from './report-section-factory';

export type ReportFooterProps = Pick<SectionProps, 'environmentInfo' | 'footerText'>;

export const ReportFooter = NamedFC<ReportFooterProps>('ReportFooter', ({ environmentInfo, footerText: Text }) => {
    return (
        <div className="report-footer-container">
            <div className="report-footer" role="contentinfo">
                <Text {...environmentInfo} />
            </div>
        </div>
    );
});
