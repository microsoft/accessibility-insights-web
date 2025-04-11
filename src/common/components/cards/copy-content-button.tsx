// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CopyDetailsIcon } from 'common/icons/copy-details-icon';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './failed-instances-markup-footer.scss';

export interface CopyContentButtonProps {
    instanceId: string;
    contentToCopy?: string;
}

export const CopyContentButton = NamedFC<CopyContentButtonProps>(
    'CopyContentButton',
    ({ instanceId, contentToCopy }) => {
        const cleanInstanceId = instanceId.replace(/[^a-zA-Z0-9]/g, '');
        const copyButtonId = `copy-button-${cleanInstanceId}`;
        const copyContentId = `copy-content-${cleanInstanceId}`;
        const notificationId = `copy-notification-${cleanInstanceId}`;

        return (
            <>
                <button
                    id={copyButtonId}
                    className={styles.feedbackButton}
                    title="Copy failure details"
                    aria-label="Copy failure details to clipboard"
                    aria-describedby={contentToCopy ? copyContentId : undefined}
                >
                    <CopyDetailsIcon />
                    <span>Copy Failure Details</span>
                </button>
                {contentToCopy && (
                    <span id={copyContentId} className={styles.hiddenContent}>
                        {contentToCopy}
                    </span>
                )}
                <div className={styles.notificationContainer}>
                    <span
                        id={notificationId}
                        className={styles.copyNotification}
                        role="status"
                        aria-live="polite"
                    >
                        Copied failure details!
                    </span>
                </div>
            </>
        );
    },
);
