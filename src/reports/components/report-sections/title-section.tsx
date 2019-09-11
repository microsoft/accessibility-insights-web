// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import * as React from 'react';

export const TitleSection = NamedFC('TitleSection', () => {
    return (
        <div className="title-section">
            <h1>Automated checks results</h1>
        </div>
    );
});
