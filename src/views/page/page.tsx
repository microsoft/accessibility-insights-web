// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { Header, HeaderDeps } from 'common/components/header';
import { NamedFC } from 'common/react/named-fc';

export type PageProps = {
    deps: PageDeps;
};

export type PageDeps = HeaderDeps;

export const Page = NamedFC<PageProps>('Page', ({ deps, children }) => {
    return (
        <>
            <Header deps={deps} />
            <main>{children}</main>
        </>
    );
});
