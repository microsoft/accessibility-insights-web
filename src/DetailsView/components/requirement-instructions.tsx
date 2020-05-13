// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponent } from 'common/components/collapsible-component';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import * as styles from './requirement-how-to-test.scss';

export interface RequirementHowToTestProps {
    howToTest: JSX.Element;
}

export const RequirementInstructionsComponent = NamedFC<RequirementHowToTestProps>(
    'RequirementInstructionsComponent',
    props => {
        return (
            <CollapsibleComponent
                header={<h2 className={styles.requirementInstructionsHeader}>How to test</h2>}
                content={props.howToTest}
                contentClassName={styles.requirementInstructions}
            />
        );
    },
);
