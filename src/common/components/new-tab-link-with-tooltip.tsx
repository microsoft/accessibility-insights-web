// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { ILinkProps, ITooltipHostStyles, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export type NewTabLinkWithTooltipProps = ILinkProps & { tooltipContent: string | undefined };

export const NewTabLinkWithTooltip = NamedFC<NewTabLinkWithTooltipProps>(
    'NewTabLinkWithTooltip',
    props => {
        const { tooltipContent, ...linkProps } = props;
        const hostStyles: Partial<ITooltipHostStyles> = {
            root: { display: 'inline-block', minWidth: 0 },
        };
        return (
            <TooltipHost content={tooltipContent} styles={hostStyles}>
                <NewTabLink {...linkProps} />
            </TooltipHost>
        );
    },
);
