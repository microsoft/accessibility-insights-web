// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingElementForLevelProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
> & {
    headingLevel: HeadingLevel;
};

export const HeadingElementForLevel = NamedFC<HeadingElementForLevelProps>(
    'HeadingElementForLevel',
    ({ headingLevel, ...props }) => React.createElement(`h${headingLevel}`, props),
);

export const GetNextHeadingLevel = (headingLevel: HeadingLevel) => {
    const nextLevel = headingLevel + 1;

    if (nextLevel > 6) {
        throw new Error(`${nextLevel} is not a valid heading level`);
    }

    return nextLevel as HeadingLevel;
};
