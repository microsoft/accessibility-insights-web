// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UnifiedResult } from '../../../common/types/store-data/unified-data-interface';

export type HighlightState = 'on' | 'off' | 'unavailable';

export type InstanceDetailsFooterDeps = {};

export type InstanceDetailsFooterProps = {
    deps: InstanceDetailsFooterDeps;
    result: UnifiedResult;
    highlightState: HighlightState;
};

export const InstanceDetailsFooter = NamedFC<InstanceDetailsFooterProps>('InstanceDetailsFooter', props => {
    const { result, highlightState, deps } = props;

    return <div>Highlight {highlightState}</div>;
});
