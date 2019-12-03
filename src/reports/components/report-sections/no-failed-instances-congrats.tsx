// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import * as styles from './no-failed-instances-congrats.scss';

export const NoFailedInstancesCongrats = NamedFC('NoFailedInstancesCongrats', () => {
    return (
        <div className={styles.reportCongratsMessage}>
            <div className={styles.reportCongratsHead}>Congratulations!</div>
            <div className={styles.reportCongratsInfo}>No failed automated checks were found.</div>
        </div>
    );
});
