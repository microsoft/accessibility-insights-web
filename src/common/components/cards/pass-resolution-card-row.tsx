// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CardRowProps } from '../../../common/configs/unified-result-property-configurations';
import { NamedFC } from '../../../common/react/named-fc';
import { CheckType } from '../../types/check-type';
import { FixInstructionPanel } from '../fix-instruction-panel';
import styles from './pass-resolution-card-row.scss';
import { SimpleCardRow } from './simple-card-row';

export interface PassResolutionPropertyData {
    // tslint:disable-next-line: no-reserved-keywords
    any: string[];
    none: string[];
    all: string[];
}

export interface PassResolutionCardRowProps extends CardRowProps {
    propertyData: PassResolutionPropertyData;
}

export const PassResolutionCardRow = NamedFC<PassResolutionCardRowProps>(
    'PassResolutionCardRow',
    ({ deps, ...props }) => {
        const { any: anyOf, all, none } = props.propertyData;

        const renderFixInstructionsContent = () => {
            return (
                <div className={styles.passResolutionContent}>
                    <FixInstructionPanel
                        deps={deps}
                        checkType={CheckType.All}
                        checks={all.concat(none).map(turnStringToMessageObject)}
                        renderTitleElement={renderFixInstructionsTitleElement}
                        isPass={true}
                    />
                    <FixInstructionPanel
                        deps={deps}
                        checkType={CheckType.Any}
                        checks={anyOf.map(turnStringToMessageObject)}
                        renderTitleElement={renderFixInstructionsTitleElement}
                        isPass={true}
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
                label="Summary"
                content={renderFixInstructionsContent()}
                rowKey={`pass-resolution-row-${props.index}`}
            />
        );
    },
);
