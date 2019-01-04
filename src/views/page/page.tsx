// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { config } from '../../common/configuration';

export const Page: React.SFC = ({ children }) => {
    const extensionFullName = config.getOption('extensionFullName');
    return <>
        <header>
            <img className="header-icon" src="../../icons/brand/white/brand-white-48px.png" alt=""></img>
            <div className="ms-font-m header-text">{extensionFullName}</div>
        </header>
        <main>
            {children}
        </main>
    </>;
};
Page.displayName = 'Page';
