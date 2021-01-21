// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { ICalloutProps, ILinkProps, ITooltipHostStyles, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import * as styles from './new-tab-link-with-tooltip.scss';

export type NewTabLinkWithTooltipProps = ILinkProps & { tooltipContent: string | undefined };

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
                <NewTabLink {...linkProps} />
            </TooltipHost>
        );
    },
);
