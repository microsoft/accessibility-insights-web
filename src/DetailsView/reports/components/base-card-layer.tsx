// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

interface BaseCardLayerProps {}

export const BaseCardLayer = NamedSFC<BaseCardLayerProps>('BaseCardLayer', props => {
    return <div className="base-card-layer-main">{props.children}</div>;
});
