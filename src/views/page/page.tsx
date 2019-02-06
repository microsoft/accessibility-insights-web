// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { HeaderIcon, HeaderIconDeps } from '../../common/components/header-icon';
import { config } from '../../common/configuration';
import { NamedSFC } from '../../common/react/named-sfc';

export type PageProps = {
    deps: PageDeps;
};

export type PageDeps = HeaderIconDeps;

export const Page = NamedSFC<PageProps>('Page', ({ deps, children }) => {
    const extensionFullName = config.getOption('extensionFullName');

    return (
        <>
            <header>
                <HeaderIcon deps={deps} />
                <div className="ms-font-m header-text">{extensionFullName}</div>
            </header>
            <main>{children}</main>
        </>
    );
});
