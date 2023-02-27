// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink, GuidanceTag } from 'common/types/store-data/guidance-links';
import { isArray, isObject } from 'lodash';

export type GetGuidanceTagsFromGuidanceLinks = (links: GuidanceLink[] | undefined) => GuidanceTag[];
export const GetGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks = links => {
    if (!links || isArray(links) === false) {
        return [];
    }

    const tags: GuidanceTag[] = [];

    links.forEach(link => {
        if (isObject(link) === false || isArray(link.tags) === false) {
            return;
        }

        link.tags!.forEach(tag => {
            tags.push(tag);
        });
    });

    return tags;
};
