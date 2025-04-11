// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import classNames from 'classnames';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CardResult } from 'common/types/store-data/card-view-model';
import { buildCopyContent } from 'common/utils/card-content-formatter';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { forOwn, isEmpty } from 'lodash';
import * as React from 'react';
import styles from 'reports/components/instance-details.scss';
import {
    CardRowDeps,
    PropertyConfiguration,
} from '../../../common/configs/unified-result-property-configurations';
import {
    StoredInstancePropertyBag,
    TargetAppData,
    UnifiedRule,
} from '../../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { MarkupFooter } from './failed-instances-markup-footer';
import { InstanceDetailsFooter, InstanceDetailsFooterDeps } from './instance-details-footer';

export const instanceCardAutomationId = 'instance-card';

export type InstanceDetailsDeps = {
    getPropertyConfigById: (id: string) => PropertyConfiguration;
} & CardRowDeps &
    InstanceDetailsFooterDeps;

export type InstanceDetailsProps = {
    deps: InstanceDetailsDeps;
    result: CardResult;
    index: number;
    userConfigurationStoreData: UserConfigurationStoreData | null;
    targetAppInfo: TargetAppData;
    rule: UnifiedRule;
    cardSelectionMessageCreator?: CardSelectionMessageCreator;
    narrowModeStatus?: NarrowModeStatus;
    feedbackURL?: string;
};

// Feedback mechanism is only enabled for results with the following guidance tags
const AI_SCAN_TAG = 'AI_SCAN';
const FEEDBACK_ENABLED_TAGS = [AI_SCAN_TAG];

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetails', props => {
    const {
        result,
        deps,
        userConfigurationStoreData,
        rule,
        targetAppInfo,
        cardSelectionMessageCreator,
        narrowModeStatus,
        feedbackURL,
    } = props;
    const [cardFocused, setCardFocus] = React.useState(false);

    const isHighlightSupported: boolean = deps.cardInteractionSupport.supportsHighlighting;

    const hasFeedbackEnabledTag = () => {
        if (!rule || !rule.guidance) return false;

        return rule.guidance.some(
            guidanceLink =>
                guidanceLink.tags &&
                guidanceLink.tags.some(tag => FEEDBACK_ENABLED_TAGS.includes(tag.id)),
        );
    };

    // Add specific check for AI_SCAN tag
    const hasAIScanTag = () => {
        if (!rule || !rule.guidance) return false;

        return rule.guidance.some(
            guidanceLink =>
                guidanceLink.tags && guidanceLink.tags.some(tag => tag.id === AI_SCAN_TAG),
        );
    };

    const instanceDetailsCardStyling = classNames({
        [styles.instanceDetailsCard]: true,
        [styles.selected]: isHighlightSupported && result.isSelected,
        [styles.focused]: isHighlightSupported && cardFocused,
        [styles.interactive]: isHighlightSupported,
    });

    const instanceDetailsCardContainerStyling = classNames({
        [styles.instanceDetailsCardContainer]: true,
        [styles.selected]: isHighlightSupported && result.isSelected,
    });

    const toggleSelectHandler = (event: React.SyntheticEvent): void => {
        event.stopPropagation();
        cardSelectionMessageCreator?.toggleCardSelection(result.ruleId, result.uid, event);
    };

    const hiddenButton = React.useRef<HTMLButtonElement>(null);
    const cardHighlightingProperties = isHighlightSupported
        ? {
              onClick: (event: React.SyntheticEvent): void => {
                  if (!(event?.target instanceof HTMLButtonElement)) {
                      hiddenButton.current?.focus();
                      hiddenButton.current?.click();
                  }
              },
              tabIndex: -1,
          }
        : {};

    // Get target path for deterministic ID generation
    const getTargetPath = (): string => {
        const target = result.identifiers?.target || 
                      result.identifiers?.identifier || 
                      result.identifiers?.conciseName || '';
        
        return typeof target === 'string' ? target : JSON.stringify(target);
    };

    return (
        <div
            data-automation-id={instanceCardAutomationId}
            className={instanceDetailsCardContainerStyling}
        >
            <div className={instanceDetailsCardStyling} {...cardHighlightingProperties}>
                <div>
                    <table className={styles.reportInstanceTable}>
                        <tbody>
                            {renderCardRowsForPropertyBag(result.identifiers, props)}
                            {renderCardRowsForPropertyBag(result.descriptors, props)}
                            {renderCardRowsForPropertyBag(result.resolution, props)}
                        </tbody>
                    </table>
                    {isHighlightSupported && cardSelectionMessageCreator !== undefined && (
                        <button
                            ref={hiddenButton}
                            onClick={toggleSelectHandler}
                            className={styles.hiddenHighlightButton}
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
                        narrowModeStatus={narrowModeStatus}
                    />
                    <MarkupFooter
                        deps={deps}
                        instanceId={result.uid}
                        contentToCopy={buildCopyContent(result)}
                        feedbackURL={hasFeedbackEnabledTag() ? feedbackURL : undefined}
                        isIssueAIdetected={hasAIScanTag()}
                        ruleId={result.ruleId}
                        index={props.index}
                        targetPath={getTargetPath()}
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
    const cardRows: JSX.Element[] = [];
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
