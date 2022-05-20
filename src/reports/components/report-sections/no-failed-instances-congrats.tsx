// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { InlineImage, InlineImageType } from 'reports/components/inline-image';
import { InstanceOutcomeType } from 'reports/components/instance-outcome-type';
import styles from './no-failed-instances-congrats.scss';

export type NoFailedInstancesCongratsDeps = {
    customCongratsContinueInvestigatingMessage?: string;
};

export type NoFailedInstancesCongratsProps = {
    deps: NoFailedInstancesCongratsDeps;
    outcomeType: InstanceOutcomeType;
};

export const NoFailedInstancesCongrats = NamedFC<NoFailedInstancesCongratsProps>(
    'NoFailedInstancesCongrats',
    props => {
        const messageSubject =
            props.outcomeType === 'review' ? 'instances to review' : 'failed automated checks';
        const continueInvestigatingMessage =
            props.deps.customCongratsContinueInvestigatingMessage ??
            "Continue investigating your website's accessibility compliance through manual testing using Tab stops and Assessment in Accessibility Insights for Web.";
        const message = `No ${messageSubject} were found. ${continueInvestigatingMessage}`;
        return (
            <div className={styles.reportCongratsMessage}>
                <div className={styles.reportCongratsHead}>Congratulations!</div>
                <div className={styles.reportCongratsInfo}>{message}</div>
                <InlineImage
                    className={styles.sleepingAda}
                    imageType={InlineImageType.SleepingAda}
                    alt=""
                />
            </div>
        );
    },
);
