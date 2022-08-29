// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { GetGuidanceTagsFromGuidanceLinks } from '../get-guidance-tags-from-guidance-links';
import { NamedFC } from '../react/named-fc';

export interface GuidanceTagsDeps {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
}
export interface GuidanceTagsProps {
    deps: GuidanceTagsDeps;
    links: GuidanceLink[];
}

export const GuidanceTags = NamedFC<GuidanceTagsProps>('GuidanceTags', props => {
    const { links, deps } = props;

    if (isEmpty(links)) {
        return null;
    }

    const tags = deps.getGuidanceTagsFromGuidanceLinks(links);

    if (isEmpty(tags)) {
        return null;
    }

    const tagElements = tags.map((tag, index) => {
        return <span key={index}>{tag.displayText}</span>;
    });

    return <span className="guidance-tags">{tagElements}</span>;
});
