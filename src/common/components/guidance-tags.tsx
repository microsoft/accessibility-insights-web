// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isArray, isEmpty, isObject } from 'lodash';
import * as React from 'react';

import { GuidanceTag } from '../../content/guidance-tags';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { NamedSFC } from '../react/named-sfc';
import { guidanceTags } from './guidance-tags.scss';

export interface GuidanceTagsDeps {}
export interface GuidanceTagsProps {
    deps: GuidanceTagsDeps;
    tags: GuidanceTag[];
}

export const GuidanceTags = NamedSFC<GuidanceTagsProps>('GuidanceTags', props => {
    const { tags } = props;

    if (isEmpty(tags)) {
        return null;
    }

    const tagElements = tags.map((tag, index) => {
        return <div key={index}>{tag.displayText}</div>;
    });

    return <div className={guidanceTags}>{tagElements}</div>;
});

export const guidanceTagsFromGuidanceLinks = (links: HyperlinkDefinition[]) => {
    const tags: GuidanceTag[] = [];

    if (isArray(links)) {
        links.forEach(link => {
            if (isObject(link) && isArray(link.tags)) {
                link.tags.forEach(tag => {
                    tags.push(tag);
                });
            }
        });
    }

    return tags;
};
