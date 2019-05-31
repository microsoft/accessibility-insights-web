// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isArray, isObject } from 'lodash';

import { GuidanceTag } from '../content/guidance-tags';
import { HyperlinkDefinition } from '../views/content/content-page';

export type GetGuidanceTagsFromGuidanceLinks = (links: HyperlinkDefinition[]) => GuidanceTag[];
export const GetGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks = links => {
    if (isArray(links) === false) {
        return [];
    }

    const tags: GuidanceTag[] = [];

    links.forEach(link => {
        if (isObject(link) === false || isArray(link.tags) === false) {
            return;
        }

        link.tags.forEach(tag => {
            tags.push(tag);
        });
    });

    return tags;
};
