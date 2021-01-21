// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink, GuidanceTag } from 'common/guidance-links';
import { isArray, isObject } from 'lodash';

export type GetGuidanceTagsFromGuidanceLinks = (links: GuidanceLink[]) => GuidanceTag[];
export const GetGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks = links => {
    if (isArray(links) === false) {
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
