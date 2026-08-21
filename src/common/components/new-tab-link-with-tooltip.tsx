// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ICalloutProps, ILinkProps, ITooltipHostStyles, TooltipHost } from '@fluentui/react';
import { NewTabLink } from 'common/components/new-tab-link';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import styles from './new-tab-link-with-tooltip.scss';

export type NewTabLinkWithTooltipProps = ILinkProps & {
    tooltipContent: string | undefined;
    className?: string | undefined;
};

export const NewTabLinkWithTooltip = NamedFC<NewTabLinkWithTooltipProps>(
    'NewTabLinkWithTooltip',
    props => {
        const { tooltipContent, className, ...linkProps } = props;
        const hostStyles: Partial<ITooltipHostStyles> = {
            root: styles.insightsTooltipHost,
        };
        const calloutProps: ICalloutProps = {
            styles: {
                root: styles.insightsTooltip,
                beak: styles.insightsTooltip,
            },
        };
        return (
            <TooltipHost content={tooltipContent} styles={hostStyles} calloutProps={calloutProps}>
                <NewTabLink className={className ?? styles.insightsLink} {...linkProps} />
            </TooltipHost>
        );
    },
);
