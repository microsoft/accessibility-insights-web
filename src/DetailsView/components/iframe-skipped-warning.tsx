// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export const IframeSkippedWarningContainerAutomationId = 'iframe-skipped-warning-container';

export const IframeSkippedWarning = NamedFC('IframeSkippedWarning', () => (
    <div data-automation-id={IframeSkippedWarningContainerAutomationId}>
        There are iframes in the target page that are non-responsive. These frames have been skipped
        and are not included in results.
    </div>
));
