// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThumbsDownIcon } from 'common/icons/thumbs-down-icon';
import { ThumbsUpIcon } from 'common/icons/thumbs-up-icon';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './failed-instances-markup-footer.scss';

export interface FeedbackButtonsProps {
    feedbackURL: string;
    instanceId: string;
    isIssueAIdetected?: boolean;
}

export const FeedbackButtons = NamedFC<FeedbackButtonsProps>(
    'FeedbackButtons',
    ({ feedbackURL, isIssueAIdetected = false }) => {
        const getFeedbackUrl = () => {
            return feedbackURL;
        };

        return (
            <>
                <a href={getFeedbackUrl()} className={styles.feedbackButton} title="Helpful">
                    <ThumbsUpIcon />
                </a>
                <a href={getFeedbackUrl()} className={styles.feedbackButton} title="Unhelpful">
                    <ThumbsDownIcon />
                </a>
                {isIssueAIdetected && (
                    <span className={styles.aiContentLabel}>
                        AI-generated content may be incorrect
                    </span>
                )}
            </>
        );
    },
);
