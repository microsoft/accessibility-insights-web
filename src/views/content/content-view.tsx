// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { Page, PageDeps } from '../page/page';

export type ContentViewDeps = PageDeps;

export type ContentViewProps = { deps: ContentViewDeps };

export const ContentView = NamedFC<ContentViewProps>('Content', ({ deps, children }) => {
    return (
        <Page deps={deps}>
            <div className="content-container">
                <div className="content-left" />
                <div className="content">{children}</div>
                <div className="content-right" />
            </div>
        </Page>
    );
});
