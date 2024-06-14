// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ICalloutProps, ITooltipHostStyles, TooltipHost } from '@fluentui/react';
import { LinkProps } from '@fluentui/react-components';
import { NewTabLink } from 'common/components/new-tab-link';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import styles from './new-tab-link-with-tooltip.scss';


export type NewTabLinkWithTooltipProps = LinkProps & { tooltipContent: string | undefined };

export const NewTabLinkWithTooltip = NamedFC<NewTabLinkWithTooltipProps>(
    'NewTabLinkWithTooltip',
    props => {
        const { tooltipContent, ...linkProps } = props;
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
                <NewTabLink className={styles.insightsLink} {...linkProps} />
            </TooltipHost>
        );
    },
);
