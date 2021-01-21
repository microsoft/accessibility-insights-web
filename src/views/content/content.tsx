// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { ContentPageDeps, ContentProvider, ContentReference } from './content-page';
import { ContentView, ContentViewDeps } from './content-view';

export type ContentDeps = { contentProvider: ContentProvider } & ContentPageDeps & ContentViewDeps;

export type ContentProps = { deps: ContentDeps; reference: ContentReference };

export const Content = NamedFC<ContentProps>('Content', ({ deps, reference }) => {
    const { contentProvider } = deps;
    const ContentPage = contentProvider.contentFromReference(reference);
    return (
        <ContentView deps={deps}>
            <ContentPage deps={deps} options={{ setPageTitle: true }} />
        </ContentView>
    );
});
