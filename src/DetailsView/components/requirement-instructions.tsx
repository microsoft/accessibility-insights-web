// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponent } from 'common/components/collapsible-component';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './requirement-instructions.scss';

export interface RequirementInstructionsProps {
    howToTest: JSX.Element;
}

export const RequirementInstructions = NamedFC<RequirementInstructionsProps>(
    'RequirementInstructions',
    props => {
        return (
            <CollapsibleComponent
                header={
                    <span
                        className={styles.requirementInstructionsHeader}
                        role="heading"
                        aria-level={2}
                    >
                        How to test
                    </span>
                }
                content={props.howToTest}
                contentClassName={styles.requirementInstructions}
            />
        );
    },
);
