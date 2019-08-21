// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';

export interface CardsViewProps {}

export const CardsView = NamedSFC<CardsViewProps>('CardsView', props => {
    return (
        <>
            <h2>Cards view</h2>
            <p>Hello, World!</p>
        </>
    );
});
