// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StartOverDeps, StartOverProps } from 'DetailsView/components/start-over-dropdown';

export type StartOverComponentDeps = StartOverDeps;

export interface StartOverComponentProps {
    deps: StartOverComponentDeps;
    render: boolean;
    startOverProps: StartOverProps;
}
