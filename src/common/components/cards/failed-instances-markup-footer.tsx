// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { CardInteractionSupport } from './card-interaction-support';
import { CopyContentButton } from './copy-content-button';
import styles from './failed-instances-markup-footer.scss';
import { FeedbackButtons } from './feedback-buttons';

export type MarkupFooterDeps = {
    cardInteractionSupport: CardInteractionSupport;
};

export interface MarkupFooterProps {
    deps: MarkupFooterDeps;
    instanceId: string;
    feedbackURL?: string;
    contentToCopy?: string;
    isIssueAIdetected?: boolean;
}

export const MarkupFooter = NamedFC<MarkupFooterProps>(
    'MarkupFooter',
    props => {
        const { deps, instanceId, feedbackURL, contentToCopy, isIssueAIdetected } = props;
        const supportsCopy = deps.cardInteractionSupport.supportsCopyFailureDetailsInMarkup;

        if (!feedbackURL && !supportsCopy) {
            return null;
        }

        return (
            <div className={styles.markupFooter}>
                {feedbackURL && (
                    <div className={styles.buttonsGroupLeft}>
                        <FeedbackButtons 
                            feedbackURL={feedbackURL} 
                            instanceId={instanceId} 
                            isIssueAIdetected={isIssueAIdetected}
                        />
                    </div>
                )}

                {supportsCopy && (
                    <div className={styles.buttonsGroupRight}>
                        <CopyContentButton instanceId={instanceId} contentToCopy={contentToCopy} />
                    </div>
                )}
            </div>
        );
    },
);
