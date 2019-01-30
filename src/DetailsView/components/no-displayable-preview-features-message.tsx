// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { DisplayableStrings } from '../../common/constants/displayable-strings';

export const NoDisplayableFeatureFlagMessage = () => (
    <>
        <div className="no-preview-feature-message">{DisplayableStrings.noPreviewFeatureDisplayMessage}</div>
    </>
);
