// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { CheckType } from '../../types/check-type';
import { FixInstructionPanel } from '../fix-instruction-panel';
import * as styles from './how-to-fix-card-row.scss';
import { SimpleCardRow } from './simple-card-row';

export interface HowToFixWebPropertyData {
    // tslint:disable-next-line: no-reserved-keywords
    any: string[];
    none: string[];
    all: string[];
}

export interface HowToFixWebCardRowProps extends CardRowProps {
    propertyData: HowToFixWebPropertyData;
}

export const HowToFixWebCardRow = NamedFC<HowToFixWebCardRowProps>(
    'HowToFixWebCardRow',
    ({ deps, ...props }) => {
        const { any: anyOf, all, none } = props.propertyData;

        const renderFixInstructionsContent = () => {
            return (
                <div className={styles.howToFixContent}>
                    <FixInstructionPanel
                        deps={deps}
                        checkType={CheckType.All}
                        checks={all.concat(none).map(turnStringToMessageObject)}
                        renderTitleElement={renderFixInstructionsTitleElement}
                    />
                    <FixInstructionPanel
                        deps={deps}
                        checkType={CheckType.Any}
                        checks={anyOf.map(turnStringToMessageObject)}
                        renderTitleElement={renderFixInstructionsTitleElement}
                    />
                </div>
            );
        };

        const turnStringToMessageObject = (s: string) => {
            return { message: s };
        };

        const renderFixInstructionsTitleElement = (titleText: string) => {
            return <div>{titleText}</div>;
        };

        return (
            <SimpleCardRow
                label="How to fix"
                content={renderFixInstructionsContent()}
                rowKey={`how-to-fix-row-${props.index}`}
            />
        );
    },
);
