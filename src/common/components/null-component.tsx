// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';

export const NullComponent = NamedFC<null>('NullComponent', () => {
    return null;
});
