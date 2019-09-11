// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { InlineImage, InlineImageType } from '../inline-image';
import {
    reportCongrats,
    reportCongratsHead,
    reportCongratsInfo,
    reportCongratsMessage,
    reportCongratsScreen,
} from './no-failed-instances-congrats.scss';

export const NoFailedInstancesCongrats = NamedFC('NoFailedInstancesCongrats', () => {
    return (
        <div className={reportCongrats} key="report-congrats">
            <div>
                <InlineImage imageType={InlineImageType.AdaLaptop} alt="" />
            </div>
            <div className={reportCongratsScreen}>
                <div className={reportCongratsMessage}>
                    <div className={reportCongratsHead}>Congratulations!</div>
                    <div className={reportCongratsInfo}>No failed automated checks were found.</div>
                </div>
            </div>
        </div>
    );
});
