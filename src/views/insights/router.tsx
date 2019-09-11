// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { NamedFC } from '../../common/react/named-sfc';
import { Content, ContentDeps } from '../content/content';

export type RouterDeps = ContentDeps;
export type RouterProps = { deps: RouterDeps };

export const RouterSwitch = NamedFC<RouterProps>('RouterSwitch', ({ deps }) => (
    <Switch>
        <Route path="/content/*" render={p => <Content deps={deps} reference={p.match.params[0]} />} />
    </Switch>
));

export const Router = NamedFC<RouterProps>('Router', ({ deps }) => (
    <HashRouter>
        <RouterSwitch deps={deps} />
    </HashRouter>
));
