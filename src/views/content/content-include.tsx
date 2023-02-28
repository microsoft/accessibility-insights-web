// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { ContentPageDeps, ContentProvider, ContentReference } from './content-page';

export type ContentIncludeDeps = {
    contentProvider: ContentProvider;
} & ContentPageDeps;

export type ContentIncludeProps = {
    deps: ContentIncludeDeps;
    content: ContentReference | undefined;
};

export const ContentInclude = NamedFC<ContentIncludeProps>(
    'ContentInclude',
    ({ deps, content }) => {
        const { contentProvider } = deps;

        if (!content) {
            return null;
        }

        const Content = contentProvider.contentFromReference(content);

        return (
            <div className="content">
                <Content deps={deps} />
            </div>
        );
    },
);
