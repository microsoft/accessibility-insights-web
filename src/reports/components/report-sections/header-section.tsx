// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { productName } from 'content/strings/application';
import { BrandWhite } from 'icons/brand/white/brand-white';

export interface HeaderSectionProps {
    pageTitle: string;
    pageUrl: string;
}

export const HeaderSection = NamedFC<HeaderSectionProps>('HeaderSection', ({ pageTitle, pageUrl }) => {
    return (
        <header>
            <div className="report-header-bar">
                <BrandWhite />
                <div className="ms-font-m header-text ms-fontWeight-semibold">{productName}</div>
            </div>
            <div className="report-header-command-bar">
                <div className="target-page">
                    Target page:&nbsp;
                    <NewTabLink href={pageUrl} title={pageTitle}>
                        {pageTitle}
                    </NewTabLink>
                </div>
            </div>
        </header>
    );
});
