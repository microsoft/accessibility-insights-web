// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { Header, HeaderDeps } from 'common/components/header';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';

export type PageProps = {
    deps: PageDeps;
};

export type PageDeps = HeaderDeps;

export const Page = NamedFC<PageProps>('Page', ({ deps, children }) => {
    return (
        <>
            <NarrowModeDetector
                isNarrowModeEnabled={true}
                Component={Header}
                childrenProps={{ deps: deps }}
            />
            <main>{children}</main>
        </>
    );
});
