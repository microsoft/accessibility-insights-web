// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { InlineImage, InlineImageType } from 'reports/components/inline-image';
import * as styles from './no-failed-instances-congrats.scss';

export const NoFailedInstancesCongrats = NamedFC('NoFailedInstancesCongrats', () => {
    return (
        <div className={styles.reportCongratsMessage}>
            <div className={styles.reportCongratsHead}>Congratulations!</div>
            <div className={styles.reportCongratsInfo}>No failed automated checks were found.</div>
            <InlineImage imageType={InlineImageType.SleepingAda} alt="" />
        </div>
    );
});
