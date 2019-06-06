// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../react/named-sfc';

export const InapplicableIcon = NamedSFC('InapplicableIcon', () => (
    <span className="check-container">
        <span className="inapplicable-icon" />
    </span>
));
