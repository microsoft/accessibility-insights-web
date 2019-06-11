// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { InlineImage, InlineImageType } from '../inline-image';

export const NoFailedInstancesCongrats = NamedSFC('NoFailedInstancesCongrats', () => {
    return (
        <div className="report-congrats" key="report-congrats">
            <div className="report-congrats-image">
                <InlineImage imageType={InlineImageType.AdaLaptop} alt="" />
            </div>
            <div className="report-congrats-screen">
                <div className="report-congrats-message">
                    <div className="report-congrats-head">Congratulations!</div>
                    <div className="report-congrats-info">No failed automated checks were found.</div>
                </div>
            </div>
        </div>
    );
});
