// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Header, HeaderDeps } from 'common/components/header';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';
import { NoContentAvailable } from 'DetailsView/components/no-content-available/no-content-available';
import * as React from 'react';

export type NoContentAvailableViewDeps = HeaderDeps;

export type NoContentAvailableViewProps = {
    deps: NoContentAvailableViewDeps;
};

export const NoContentAvailableView = NamedFC<NoContentAvailableViewProps>(
    'NoContentAvailableView',
    ({ deps }) => (
        <>
            <NarrowModeDetector
                isNarrowModeEnabled={true}
                Component={Header}
                childrenProps={{ deps: deps }}
            />
            <NoContentAvailable />
        </>
    ),
);
