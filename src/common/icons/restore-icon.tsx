// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

const d = 'M2048 1638h-410v410H0V410h410V0h1638v1638zM1434 614H205v1229h1229V614zm409-409H614v205h1024v1024h205V205z';

export const RestoreIcon = NamedFC('RestoreIcon', () => (
    <svg width="20" height="20" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <path d={d} />
    </svg>
));
