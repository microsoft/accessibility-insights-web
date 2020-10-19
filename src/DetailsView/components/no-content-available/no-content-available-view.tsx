// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Header, HeaderDeps, HeaderProps } from 'common/components/header';
import { NamedFC } from 'common/react/named-fc';
import {
    NarrowModeDetector,
    NarrowModeDetectorDeps,
} from 'DetailsView/components/narrow-mode-detector';
import { NoContentAvailable } from 'DetailsView/components/no-content-available/no-content-available';
import * as React from 'react';

export type NoContentAvailableViewDeps = HeaderDeps & NarrowModeDetectorDeps;

export type NoContentAvailableViewProps = {
    deps: NoContentAvailableViewDeps;
};

export const NoContentAvailableView = NamedFC<NoContentAvailableViewProps>(
    'NoContentAvailableView',
    ({ deps }) => {
        const headerProps: Omit<HeaderProps, 'narrowModeStatus'> = {
            deps,
        };

        return (
            <>
                <NarrowModeDetector
                    deps={deps}
                    isNarrowModeEnabled={true}
                    Component={Header}
                    childrenProps={headerProps}
                />
                <NoContentAvailable />
            </>
        );
    },
);
