// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Header, HeaderDeps, HeaderProps } from 'common/components/header';
import { NamedFC } from 'common/react/named-fc';
import {
    NarrowModeDetector,
    NarrowModeDetectorDeps,
} from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';

export type PageProps = {
    deps: PageDeps;
};

export type PageDeps = HeaderDeps & NarrowModeDetectorDeps;

export const Page = NamedFC<PageProps>('Page', ({ deps, children }) => {
    const headerProps: Omit<HeaderProps, 'narrowModeStatus'> = { deps: deps };

    return (
        <>
            <NarrowModeDetector
                deps={deps}
                isNarrowModeEnabled={true}
                Component={Header}
                childrenProps={headerProps}
            />
            <main>{children}</main>
        </>
    );
});
