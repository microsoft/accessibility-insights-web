// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'DetailsView/components/getting-started-view.scss';
import * as React from 'react';

export interface GettingStartedViewProps {
    gettingStartedContent: JSX.Element;
}

export const GettingStartedView = NamedFC<GettingStartedViewProps>('GettingStartedView', props => {
    return (
        <div className={styles.gettingStartedView}>
            <h2>Getting Started</h2>
            {props.gettingStartedContent}
        </div>
    );
});
