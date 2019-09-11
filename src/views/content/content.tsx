// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { Page, PageDeps } from '../page/page';
import { ContentPageDeps, ContentProvider, ContentReference } from './content-page';

export type ContentDeps = { contentProvider: ContentProvider } & ContentPageDeps & PageDeps;

export type ContentProps = { deps: ContentDeps; reference: ContentReference };

export const Content = NamedFC<ContentProps>('Content', ({ deps, reference }) => {
    const { contentProvider } = deps;
    const ContentPage = contentProvider.contentFromReference(reference);
    return (
        <Page deps={deps}>
            <div className="content-container">
                <div className="content-left" />
                <div className="content">
                    <ContentPage deps={deps} options={{ setPageTitle: true }} />
                </div>
                <div className="content-right" />
            </div>
        </Page>
    );
});
