// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ExternalLinkDeps } from '../../../common/components/external-link';
import { NamedSFC } from '../../../common/react/named-sfc';
import { HyperlinkDefinition } from '../../../views/content/content-page';
import { HelpLinks } from './overview-help-links';

export type HelpLinkDeps = ExternalLinkDeps;

export interface OverviewHelpProps {
    deps: HelpLinkDeps;
    linkDataSource: HyperlinkDefinition[];
}

export const OverviewHelpSection = NamedSFC('OverviewHelpSection', (props: OverviewHelpProps) => {
    return (
        <section className="overview-help-container">
            <h3 className="help-heading">Help</h3>
            <HelpLinks linkInformation={props.linkDataSource} deps={props.deps} />
        </section>
    );
});
