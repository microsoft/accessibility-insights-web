// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { ReportCollapsibleContainerProps } from 'reports/components/report-sections/report-collapsible-container';
import styles from './collapsible-url-result-section.scss';

export type CollapsibleUrlResultSectionDeps = {
    collapsibleControl: (props: ReportCollapsibleContainerProps) => JSX.Element;
};

export type CollapsibleUrlResultSectionProps = Omit<ResultSectionTitleProps, 'titleSize'> & {
    deps: CollapsibleUrlResultSectionDeps;
    containerId: string;
    content: JSX.Element;
};

export const CollapsibleUrlResultSection = NamedFC<CollapsibleUrlResultSectionProps>(
    'CollapsibleUrlResultSection',
    props => {
        const { containerId, deps, content } = props;
        const CollapsibleContent = deps.collapsibleControl({
            id: containerId,
            header: <ResultSectionTitle {...props} titleSize="heading" />,
            content,
            headingLevel: 3,
        });

        return <div className={styles.urlResultSection}>{CollapsibleContent}</div>;
    },
);
