// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { NamedSFC } from '../../common/react/named-sfc';
import { Content, ContentDeps } from '../content/content';

export type RouterDeps = ContentDeps;
export type RouterProps = { deps: RouterDeps };

export const RouterSwitch = NamedSFC<RouterProps>('RouterSwitch', ({ deps }) => (
    <Switch>
        <Route path="/content/:path+" render={p => <Content deps={deps} reference={p.match.params.path} />} />
    </Switch>
));

export const Router = NamedSFC<RouterProps>('Router', ({ deps }) => (
    <HashRouter>
        <RouterSwitch deps={deps} />
    </HashRouter>
));
