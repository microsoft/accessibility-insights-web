// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { title } from 'content/strings/application';
import { HeaderIcon, HeaderIconDeps } from '../../common/components/header-icon';
import { NamedFC } from '../../common/react/named-fc';

export type PageProps = {
    deps: PageDeps;
};

export type PageDeps = HeaderIconDeps;

export const Page = NamedFC<PageProps>('Page', ({ deps, children }) => {
    return (
        <>
            <header className="header-bar">
                <HeaderIcon deps={deps} />
                <div className="ms-font-m header-text">{title}</div>
            </header>
            <main>{children}</main>
        </>
    );
});
