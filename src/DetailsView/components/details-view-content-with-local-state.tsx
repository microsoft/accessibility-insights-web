// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import { DetailsViewContainerProps } from 'DetailsView/details-view-container';
import * as React from 'react';

export type DetailsViewContentWithLocalStateProps = DetailsViewContainerProps;

export const DetailsViewContentWithLocalState = NamedFC<DetailsViewContentWithLocalStateProps>(
    'DetailsViewContentWithLocalState',
    props => {
        const [isSideNavOpen, setSideNavOpen] = React.useState(false);

        return (
            <DetailsViewContent
                {...props}
                isSideNavOpen={isSideNavOpen}
                setSideNavOpen={setSideNavOpen}
            />
        );
    },
);
