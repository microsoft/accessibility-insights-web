// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { androidAppTitle } from 'content/strings/application';
import { BrandWhite } from 'icons/brand/white/brand-white';
import * as React from 'react';

export const UnifiedHeaderSection = NamedFC('UnifiedHeaderSection', () => {
    return (
        <header>
            <div className="report-header-bar">
                <BrandWhite />
                <div className="ms-font-m header-text ms-fontWeight-semibold">
                    {androidAppTitle}
                </div>
            </div>
        </header>
    );
});
