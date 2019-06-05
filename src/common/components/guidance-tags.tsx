// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import * as React from 'react';

import { HyperlinkDefinition } from '../../views/content/content-page';
import { GetGuidanceTagsFromGuidanceLinks } from '../get-guidance-tags-from-guidance-links';
import { NamedSFC } from '../react/named-sfc';
import { guidanceTags } from './guidance-tags.scss';

export interface GuidanceTagsDeps {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
}
export interface GuidanceTagsProps {
    deps: GuidanceTagsDeps;
    links: HyperlinkDefinition[];
}

export const GuidanceTags = NamedSFC<GuidanceTagsProps>('GuidanceTags', props => {
    const { links, deps } = props;

    if (isEmpty(links)) {
        return null;
    }

    const tags = deps.getGuidanceTagsFromGuidanceLinks(links);

    const tagElements = tags.map((tag, index) => {
        return <div key={index}>{tag.displayText}</div>;
    });

    return <div className={guidanceTags}>{tagElements}</div>;
});
