// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import * as React from 'react';

import { GuidanceTag } from '../../content/guidance-tags';
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
