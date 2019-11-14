// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import {
    reportCongratsHead,
    reportCongratsInfo,
    reportCongratsMessage,
} from './no-failed-instances-congrats.scss';

export const NoFailedInstancesCongrats = NamedFC(
    'NoFailedInstancesCongrats',
    () => {
        return (
            <div className={reportCongratsMessage}>
                <div className={reportCongratsHead}>Congratulations!</div>
                <div className={reportCongratsInfo}>
                    No failed automated checks were found.
                </div>
            </div>
        );
    },
);
