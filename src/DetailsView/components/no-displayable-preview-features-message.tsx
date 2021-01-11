// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DisplayableStrings } from 'common/constants/displayable-strings';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import * as styles from './no-displayable-preview-features-message.scss';

export const NoDisplayableFeatureFlagMessage = NamedFC('NoDisplayableFeatureFlagMessage', () => (
    <>
        <div className={styles.noPreviewFeatureMessage}>
            {DisplayableStrings.noPreviewFeatureDisplayMessage}
        </div>
    </>
));
