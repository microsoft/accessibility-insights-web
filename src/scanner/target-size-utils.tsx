/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { DictionaryStringTo } from 'types/common-types';
import { TargetSizePropertyBag } from 'common/types/property-bag/target-size-property-bag';
import * as React from 'react';
import * as Markup from 'assessments/markup';

const targetSizeMessageMap: DictionaryStringTo<any> = {
    size: {
        pass: {
            default: props => (
                <React.Fragment>
                    Element has sufficient touch target size ({props.height}px by {props.width}
                    px).
                </React.Fragment>
            ),
            obscured: props => <>OBSCURED</>,
            large: props => <>LARGE</>, //4.9
        },
        fail: {
            default: props => (
                <React.Fragment>
                    Element has <Markup.Term>insufficient</Markup.Term> touch target size (
                    {props.height}px by {props.width}
                    px, should be at least {props.minSize}px by {props.minSize}px){' '}
                </React.Fragment>
            ),
            partiallyObscured: props => (
                <React.Fragment>
                    Element has <Markup.Term>insufficient</Markup.Term> touch target size (
                    {props.height}px by {props.width}
                    px, should be at least {props.minSize}px by {props.minSize}px) because it is
                    partially obscured.
                </React.Fragment>
            ),
        },
        incomplete: {
            default: props => (
                <React.Fragment>
                    Element has negative tabindex with <Markup.Term>insufficient</Markup.Term> touch
                    target size ({props.height}px by {props.width}px, should be at least{' '}
                    {props.minSize}px by
                    {props.minSize}px). This may be OK if the element is not a touch target.
                </React.Fragment>
            ),
            contentOverflow: props => (
                <React.Fragment>
                    <Markup.Term>Unknown</Markup.Term>: Element touch target size could not be
                    accurately determined due to overflow content.
                </React.Fragment>
            ),
            partiallyObscured: props => (
                <React.Fragment>
                    <Markup.Term>Unknown</Markup.Term>: Element with negative tabindex has
                    insufficient touch target size because it is partially obscured. This may be OK
                    if the element is not a touch target.
                </React.Fragment>
            ),
            partiallyObscuredNonTabbable: props => (
                <React.Fragment>
                    <Markup.Term>Unknown</Markup.Term>: Element has insufficient touch target size
                    because it is partially obscured by a neighbor with negative tabindex. This may
                    be OK if the neighbor is not a touch target.
                </React.Fragment>
            ),
            tooManyRects: props => (
                <React.Fragment>
                    <Markup.Term>Unknown</Markup.Term>: Could not determine element target size
                    because there are too many overlapping elements.
                </React.Fragment>
            ),
        },
    },
    offset: {
        pass: {
            default: props => (
                <React.Fragment>
                    Element has sufficient offset from its closest neighbor ({props.closestOffset}
                    px)
                </React.Fragment>
            ),
            large: props => <>LARGE</>,
        },
        fail: {
            default: props => (
                <React.Fragment>
                    Element has insufficient offset to its closest neighbor ({props.closestOffset}
                    px in diameter, should be at least {props.minOffset}px in diameter)
                </React.Fragment>
            ),
        },
        incomplete: {
            default: props => (
                <React.Fragment>
                    Element with negative tabindex has insufficient offset to its closest neighbor.
                    This may be OK if the element is not a touch target.
                </React.Fragment>
            ),
            nonTabbableNeighbor: props => (
                <React.Fragment>
                    Element has sufficient offset from its closest neighbor and the closest neighbor
                    has a negative tabindex. This may be OK if the neighbor is not a touch target.
                </React.Fragment>
            ),
        },
    },
};

const getTargetSizeMessageComponentForRule: (
    ruleType: 'size' | 'offset',
    propertyBag: TargetSizePropertyBag,
) => typeof React.Component = (ruleType: 'size' | 'offset', propertyBag: TargetSizePropertyBag) => {
    const status = propertyBag[`${ruleType}Status`] as string;
    if (status == null) {
        return null;
    }
    const messageKey = (propertyBag[`${ruleType}MessageKey`] as string) || 'default';
    console.log(ruleType, messageKey, status);
    return targetSizeMessageMap[ruleType][status][messageKey];
};

export const getTargetSizeColumnComponents: (
    ruleType: 'size' | 'offset',
) => (propertyBag: TargetSizePropertyBag) => typeof React.Component =
    (ruleType: 'size' | 'offset') => (propertyBag: TargetSizePropertyBag) => {
        return getTargetSizeMessageComponentForRule(ruleType, propertyBag);
    };
