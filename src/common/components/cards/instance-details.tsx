// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import classNames from 'classnames';
import { NamedFC } from 'common/react/named-fc';
import { CardResult } from 'common/types/store-data/card-view-model';
import { forOwn, isEmpty } from 'lodash';
import * as React from 'react';
import {
    focused,
    hiddenHighlightButton,
    instanceDetailsCard,
    instanceDetailsCardContainer,
    interactive,
    reportInstanceTable,
    selected,
} from 'reports/components/instance-details.scss';

import {
    CardRowDeps,
    PropertyConfiguration,
} from '../../../common/configs/unified-result-property-configurations';
import { CardSelectionMessageCreator } from '../../../common/message-creators/card-selection-message-creator';
import {
    StoredInstancePropertyBag,
    TargetAppData,
    UnifiedRule,
} from '../../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { InstanceDetailsFooter, InstanceDetailsFooterDeps } from './instance-details-footer';

export const instanceCardAutomationId = 'instance-card';

export type InstanceDetailsDeps = {
    getPropertyConfigById: (id: string) => PropertyConfiguration;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
} & CardRowDeps &
    InstanceDetailsFooterDeps;

export type InstanceDetailsProps = {
    deps: InstanceDetailsDeps;
    result: CardResult;
    index: number;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    rule: UnifiedRule;
};

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetails', props => {
    const { result, deps, userConfigurationStoreData, rule, targetAppInfo } = props;
    const [cardFocused, setCardFocus] = React.useState(false);

    const isHighlightSupported: boolean = deps.cardInteractionSupport.supportsHighlighting;

    const instanceDetailsCardStyling = classNames({
        [instanceDetailsCard]: true,
        [selected]: isHighlightSupported && result.isSelected,
        [focused]: isHighlightSupported && cardFocused,
        [interactive]: isHighlightSupported,
    });

    const instanceDetailsCardContainerStyling = classNames({
        [instanceDetailsCardContainer]: true,
        [selected]: isHighlightSupported && result.isSelected,
    });

    const toggleSelectHandler = (event: React.SyntheticEvent): void => {
        event.stopPropagation();
        deps.cardSelectionMessageCreator.toggleCardSelection(result.ruleId, result.uid, event);
    };

    const hiddenButton = React.useRef(null);
    const cardHighlightingProperties = isHighlightSupported
        ? {
              onClick: (_: React.SyntheticEvent): void => {
                  hiddenButton.current?.focus();
                  hiddenButton.current?.click();
              },
              tabIndex: -1,
          }
        : {};

    return (
        <div
            data-automation-id={instanceCardAutomationId}
            className={instanceDetailsCardContainerStyling}
        >
            <div className={instanceDetailsCardStyling} {...cardHighlightingProperties}>
                <div>
                    <table className={reportInstanceTable}>
                        <tbody>
                            {renderCardRowsForPropertyBag(result.identifiers, props)}
                            {renderCardRowsForPropertyBag(result.descriptors, props)}
                            {renderCardRowsForPropertyBag(result.resolution, props)}
                        </tbody>
                    </table>
                    {isHighlightSupported && (
                        <button
                            ref={hiddenButton}
                            onClick={toggleSelectHandler}
                            className={hiddenHighlightButton}
                            aria-label={`highlight ${
                                result.identifiers && result.identifiers.identifier
                                    ? result.identifiers.identifier
                                    : ''
                            }`}
                            aria-pressed={result.isSelected}
                            onFocus={_ => setCardFocus(true)}
                            onBlur={_ => setCardFocus(false)}
                        ></button>
                    )}
                    <InstanceDetailsFooter
                        deps={deps}
                        result={result}
                        userConfigurationStoreData={userConfigurationStoreData}
                        rule={rule}
                        targetAppInfo={targetAppInfo}
                    />
                </div>
            </div>
        </div>
    );
});

const renderCardRowsForPropertyBag = (
    propertyBag: StoredInstancePropertyBag,
    props: InstanceDetailsProps,
) => {
    let propertyIndex = 0;
    const cardRows = [];
    forOwn(propertyBag, (propertyData, propertyName) => {
        const propertyConfig = props.deps.getPropertyConfigById(propertyName);
        if (!isEmpty(propertyConfig)) {
            const CardRow = propertyConfig.cardRow;
            ++propertyIndex;
            cardRows.push(
                <CardRow
                    deps={props.deps}
                    propertyData={propertyData}
                    index={props.index}
                    key={`${propertyName}-${propertyIndex}`}
                />,
            );
        }
    });
    return <>{cardRows}</>;
};
