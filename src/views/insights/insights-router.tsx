// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { HashRouter, Route, Routes, useParams } from 'react-router-dom';

import { ContentDeps, ContentProps } from '../content/content';

export type ContentRouteDeps = ContentDeps & {
    ContentRootComponent: React.FC<React.PropsWithChildren<ContentProps>>;
};
export type ContentRouteProps = { deps: ContentRouteDeps };

export const ContentRoute = NamedFC<ContentRouteProps>('ContentRoute', ({ deps }) => {
    const params = useParams();
    return <deps.ContentRootComponent deps={deps} reference={params['*']} />;
});

export const InsightsRoutes = NamedFC<ContentRouteProps>('ContentRoutes', ({ deps }) => (
    <Routes>
        <Route path="/content/*" element={<ContentRoute deps={deps} />} />
    </Routes>
));

export const InsightsRouter = NamedFC<ContentRouteProps>('ContentHashRouter', ({ deps }) => (
    <HashRouter>
        <InsightsRoutes deps={deps} />
    </HashRouter>
));
