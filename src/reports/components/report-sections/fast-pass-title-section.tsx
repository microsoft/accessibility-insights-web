// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export const FastPassTitleSection = NamedFC('FastPassTitleSection', () => {
    return (
        <div className="title-section">
            <h1>FastPass results</h1>
        </div>
    );
});
