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
    ({ feedbackURL, instanceId, isIssueAIdetected = false }) => {
        const buildFeedbackUrl = (type: string) => {
            const baseUrl = feedbackURL.endsWith('/') ? feedbackURL : `${feedbackURL}/`;
            return `${baseUrl}?feedback=${type}&instanceId=${encodeURIComponent(instanceId)}`;
        };

        return (
            <>
                <a href={buildFeedbackUrl('helpful')} className={styles.feedbackButton} title="Helpful">
                    <ThumbsUpIcon />
                </a>
                <a href={buildFeedbackUrl('unhelpful')} className={styles.feedbackButton} title="Unhelpful">
                    <ThumbsDownIcon />
                </a>
                {isIssueAIdetected && (
                    <span className={styles.aiContentLabel}>AI-generated content may be incorrect</span>
                )}
            </>
        );
    },
);
