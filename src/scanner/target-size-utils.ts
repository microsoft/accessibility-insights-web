/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { DictionaryStringTo } from 'types/common-types';
import { TargetSizePropertyBag } from 'common/types/property-bag/target-size-property-bag';

const targetSizeMessageMap: DictionaryStringTo<any> = {
    size: {
        pass: {
            default: props =>
                `Element has sufficient touch target size (${props.height}px by ${props.width}px).`,
            obscured: props => `OBSCURED`,
            large: props => `LARGE`,
        },
        fail: {
            default: props =>
                `Element has insufficient touch target size (${props.height}px by ${props.width}px, should be at least ${props.minSize}px by ${props.minSize}px) `,
            partiallyObscured: props =>
                `Element has insufficient touch target size (${props.height}px by ${props.width}px, should be at least ${props.minSize}px by ${props.minSize}px) because it is partially obscured.`,
        },
        incomplete: {
            default: props =>
                `Element has negative tabindex with insufficient touch target size (${props.height}px by ${props.width}px, should be at least ${props.minSize}px by ${props.minSize}px). This may be OK if the element is not a touch target.`,
            contentOverflow: props =>
                `Unknown: Element touch target size could not be accurately determined due to overflow content.`,
            partiallyObscured: props =>
                `Unknown: Element with negative tabindex has insufficient touch target size because it is partially obscured. This may be OK if the element is not a touch target.`,
            partiallyObscuredNonTabbable: props =>
                `Unknown: Element has insufficient touch target size because it is partially obscured by a neighbor with negative tabindex. This may be OK if the neighbor is not a touch target.`,
            tooManyRects: props =>
                `Unknown: Could not determine element target size because there are too many overlapping elements. `,
        },
    },
    offset: {
        pass: {
            default: props =>
                `Element has sufficient offset from its closest neighbor (${props.closestOffset}px)`,
            large: props => `LARGE`,
        },
        fail: {
            default: props =>
                `Element has insufficient offset to its closest neighbor (${props.closestOffset}px in diameter, should be at least ${props.minOffset}px in diameter)`,
        },
        incomplete: {
            default: props =>
                `Element with negative tabindex has insufficient offset to its closest neighbor. This may be OK if the element is not a touch target.`,
            nonTabbableNeighbor: props =>
                `Element has sufficient offset from its closest neighbor and the closest neighbor has a negative tabindex. This may be OK if the neighbor is not a touch target.`,
        },
    },
};
export const getTargetSizeMessage = (
    rule: string,
    status: string,
    propertyBag: TargetSizePropertyBag,
): string => {
    console.log('getTargetSizeMessage', rule, status, propertyBag);
    const messageKey = propertyBag.messageKey || 'default';
    const messageProps = {
        height: propertyBag.height,
        width: propertyBag.width,
        closestOffset: propertyBag.closestOffset,
        minOffset: propertyBag.minOffset,
        minSize: propertyBag.minSize,
    };
    return targetSizeMessageMap[rule.split('-')[1]][status][messageKey](messageProps);
};
