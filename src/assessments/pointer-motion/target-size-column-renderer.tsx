// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import * as Markup from 'assessments/markup';
import { ColumnValueBag } from 'common/types/property-bag/column-value-bag';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import { PropertyBagColumnRendererFactory } from '../common/property-bag-column-renderer-factory';
import { TargetSizePropertyBag } from 'common/types/property-bag/target-size-property-bag';

export function targetSizeColumnRenderer<TPropertyBag extends ColumnValueBag>(
    item: InstanceTableRow<any>,
    configs: PropertyBagColumnRendererConfig<TPropertyBag>[],
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const renderColumnComponent = (
        propertyBag: TargetSizePropertyBag,
        columnComponent: (props: TargetSizePropertyBag) => JSX.Element,
    ) => {
        return columnComponent(propertyBag);
    };

    if (
        propertyBag.sizeStatus &&
        hasNeededProperties(['height', 'width', 'minSize'], propertyBag)
    ) {
        propertyBag.sizeMessageKey = propertyBag.sizeMessageKey || 'default';

        propertyBag.sizeComponent = (
            <span id="target-size" className="expanded-property-div">
                {renderColumnComponent(
                    propertyBag,
                    getTargetSizeMessageComponentFromPropertyBag(propertyBag),
                )}
            </span>
        );
    }
    if (
        propertyBag.offsetStatus &&
        hasNeededProperties(['closestOffset', 'minOffset'], propertyBag)
    ) {
        propertyBag.offsetMessageKey = propertyBag.offsetMessageKey || 'default';
        propertyBag.offsetComponent = (
            <span id="target-offset" className="expanded-property-div">
                {renderColumnComponent(
                    propertyBag,
                    getTargetOffsetMessageComponentFromPropertyBag(propertyBag),
                )}
            </span>
        );
    }

    const propertyBagRenderer = PropertyBagColumnRendererFactory.getRenderer<TPropertyBag>(configs);

    return propertyBagRenderer(item);
}

function hasNeededProperties(
    neededProperties: string[],
    propertyBag: TargetSizePropertyBag,
): boolean {
    return !neededProperties.some(key => propertyBag.hasOwnProperty(key) === false);
}

export function getTargetSizeMessageComponentFromPropertyBag(
    propertyBag: TargetSizePropertyBag,
): (props: TargetSizePropertyBag) => JSX.Element {
    return statusWithMessageKeyToMessageComponentMapping.size[propertyBag.sizeStatus][
        propertyBag.sizeMessageKey
    ];
}

export function getTargetOffsetMessageComponentFromPropertyBag(
    propertyBag: TargetSizePropertyBag,
): (props: TargetSizePropertyBag) => JSX.Element {
    return statusWithMessageKeyToMessageComponentMapping.offset[propertyBag.offsetStatus][
        propertyBag.offsetMessageKey
    ];
}

const statusWithMessageKeyToMessageComponentMapping: DictionaryStringTo<
    DictionaryStringTo<DictionaryStringTo<(props: TargetSizePropertyBag) => JSX.Element>>
> = {
    size: {
        pass: {
            default: props => (
                <>
                    Element has sufficient touch target size ({props.height}px by {props.width}
                    px).
                </>
            ),
            obscured: props => (
                <>Element was ignored because it is fully obscured and not clickable.</>
            ),
            large: props => <>Element has sufficient touch target size.</>,
        },
        fail: {
            default: props => (
                <>
                    Element has <Markup.Term>insufficient</Markup.Term> touch target size (
                    {props.height}px by {props.width}
                    px, should be at least {props.minSize}px by {props.minSize}px){' '}
                </>
            ),
            partiallyObscured: props => (
                <>
                    Element has <Markup.Term>insufficient</Markup.Term> touch target size (
                    {props.height}px by {props.width}
                    px, should be at least {props.minSize}px by {props.minSize}px) because it is
                    partially obscured.
                </>
            ),
        },
        incomplete: {
            default: props => (
                <>
                    Element has negative tabindex with <Markup.Term>insufficient</Markup.Term> touch
                    target size ({props.height}px by {props.width}px, should be at least{' '}
                    {props.minSize}px by
                    {props.minSize}px). This <Markup.Term>may be OK</Markup.Term> if the element is
                    not a touch target.
                </>
            ),
            contentOverflow: props => (
                <>
                    Element touch target size{' '}
                    <Markup.Term>could not be accurately determined</Markup.Term> due to overflow
                    content.
                </>
            ),
            partiallyObscured: props => (
                <>
                    Element with negative tabindex has
                    <Markup.Term>insufficient</Markup.Term> touch target size because it is
                    partially obscured. This <Markup.Term>may be OK</Markup.Term> if the element is
                    not a touch target.
                </>
            ),
            partiallyObscuredNonTabbable: props => (
                <>
                    Element has <Markup.Term>insufficient</Markup.Term>
                    touch target size because it is partially obscured by a neighbor with negative
                    tabindex. This <Markup.Term>may be OK</Markup.Term> if the neighbor is not a
                    touch target.
                </>
            ),
            tooManyRects: props => (
                <>
                    <Markup.Term>Could not determine element target size</Markup.Term>
                    because there are too many overlapping elements.
                </>
            ),
        },
    },
    offset: {
        pass: {
            default: props => (
                <>
                    Element has sufficient offset from its closest neighbor ({props.closestOffset}
                    px)
                </>
            ),
            large: props => <>Element has sufficient offset from its closest neighbor.</>,
        },
        fail: {
            default: props => (
                <>
                    Element has <Markup.Term>insufficient</Markup.Term> offset to its closest
                    neighbor ({props.closestOffset}
                    px in diameter, should be at least {props.minOffset}px in diameter)
                </>
            ),
        },
        incomplete: {
            default: props => (
                <>
                    Element with negative tabindex has
                    <Markup.Term>insufficient</Markup.Term> offset to its closest neighbor. This{' '}
                    <Markup.Term>may be OK</Markup.Term> if the element is not a touch target.
                </>
            ),
            nonTabbableNeighbor: props => (
                <>
                    Element has <Markup.Term>sufficient</Markup.Term> offset from its closest
                    neighbor and the closest neighbor has a negative tabindex. This{' '}
                    <Markup.Term>may be OK</Markup.Term> if the neighbor is not a touch target.
                </>
            ),
        },
    },
};
