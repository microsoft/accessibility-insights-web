// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/utilities';
import { HeadingElementForLevel, HeadingLevel } from 'common/components/heading-element-for-level';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export interface ReportCollapsibleContainerProps {
    id: string;
    header: JSX.Element;
    content: JSX.Element;
    headingLevel: number;
    contentClassName?: string;
    containerClassName?: string;
    buttonAriaLabel?: string;
    testKey?: string;
    onExpandToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ReportCollapsibleContainer = NamedFC<ReportCollapsibleContainerProps>(
    'ReportCollapsibleContainer',
    props => {
        const { id, header, headingLevel, content, containerClassName, buttonAriaLabel } = props;

        const contentId = `content-container-${id}` + (props.testKey ? `-${props.testKey}` : '');

        const outerDivClassName = css('collapsible-container', containerClassName, 'collapsed');

        return (
            <div className={outerDivClassName}>
                <HeadingElementForLevel
                    headingLevel={headingLevel as HeadingLevel}
                    className="title-container"
                >
                    <button
                        className="collapsible-control"
                        aria-expanded="false"
                        aria-controls={contentId}
                        aria-label={buttonAriaLabel}
                    >
                        {header}
                    </button>
                </HeadingElementForLevel>
                <div id={contentId} className="collapsible-content" aria-hidden="true">
                    {content}
                </div>
            </div>
        );
    },
);

export const ReportCollapsibleContainerControl = (
    collapsibleControlProps: ReportCollapsibleContainerProps,
) => <ReportCollapsibleContainer {...collapsibleControlProps} />;
