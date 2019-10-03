// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { h1, text } from './header-section.scss';

export const HeaderSection = NamedFC('HeaderSection', () => {
    return (
        <>
            <h1 className={h1}>Automated checks</h1>
            <span className={text}>
                Automated checks can detect some common accessibility problems such as missing or invalid properties. But most accessibility
                problems can only be discovered through manual testing.
            </span>
        </>
    );
});
