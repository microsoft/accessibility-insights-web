// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';

export const ResultsContainer = NamedSFC('ResultsContainer', ({ children }) => {
    return <div className="results-container">{children}</div>;
});
