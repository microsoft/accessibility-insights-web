// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { each, forOwn, map } from 'lodash';

import { DrawerUtils } from './drawer-utils';
import { SVGNamespaceUrl } from './svg-constants';

export class SVGSolidShadowFilterFactory {
    private static readonly filterIdSuffix = 'solid-shadow';
    private drawerUtils: DrawerUtils;
    private filterIdPrefix: string;

    constructor(drawerUtils: DrawerUtils, filterIdPrefix: string) {
        this.drawerUtils = drawerUtils;
        this.filterIdPrefix = filterIdPrefix;
    }

    public get filterId(): string {
        return `${this.filterIdPrefix}-${SVGSolidShadowFilterFactory.filterIdSuffix}`;
    }

    public createFilter(): Element {
        const doc = this.drawerUtils.getDocumentElement();

        const filter = this.createFilterElement(doc);

        const morphology = this.createMorphologyElement();
        filter.appendChild(morphology);

        const offsetProps: FeOffsetParams[] = [
            { dx: 1, dy: 0, result: 'shadow_1' },
            { dx: -1, dy: 0, result: 'shadow_2' },
            { dx: 0, dy: 1, result: 'shadow_3' },
            { dx: 0, dy: -1, result: 'shadow_4' },
        ];

        const offsets = map(offsetProps, offset => this.createOffsetElement(doc, offset));
        each(offsets, offset => filter.appendChild(offset));

        const mergeIns = map(offsetProps, 'result');
        mergeIns.push('expand');
        const mergeOffsets = this.createMergeElement(doc, mergeIns, 'shadow');

        filter.appendChild(mergeOffsets);

        const feFlood = this.createFloodElement(doc, 'white');
        filter.appendChild(feFlood);

        const feComposite = this.createCompositeElement(doc, 'in', 'shadow', 'shadow');
        filter.appendChild(feComposite);

        const finalMergeIns = ['shadow', 'SourceGraphic'];
        const finalMerge = this.createMergeElement(doc, finalMergeIns);

        filter.appendChild(finalMerge);

        return filter;
    }

    private createCompositeElement(
        doc: Document,
        operator: string,
        result: string,
        in2: string,
    ): Element {
        return new FeElementBuilder<FeCompositeParams>(this.drawerUtils, 'feComposite')
            .setupParam('operator', operator)
            .setupParam('result', result)
            .setupParam('in2', in2)
            .build();
    }

    private createFloodElement(doc: Document, floodColor: string): Element {
        return new FeElementBuilder<FeFloodParams>(this.drawerUtils, 'feFlood')
            .setupParam('flood-color', floodColor)
            .build();
    }

    private createMergeElement(doc: Document, mergeNodeIns: string[], result?: string): Element {
        const mergeNodes: Element[] = map(mergeNodeIns, inParam => {
            return new FeElementBuilder<FeMergeNodeParams>(this.drawerUtils, 'feMergeNode')
                .setupParam('in', inParam)
                .build();
        });

        return new FeElementBuilder<FeMergeParams>(this.drawerUtils, 'feMerge')
            .setupParam('result', result)
            .appendChildren(mergeNodes)
            .build();
    }

    private createOffsetElement(doc: Document, props: FeOffsetParams): Element {
        return new FeElementBuilder<FeOffsetParams>(this.drawerUtils, 'feOffset')
            .setupParam('in', props.in || 'expand')
            .setupParam('dx', props.dx)
            .setupParam('dy', props.dy)
            .setupParam('result', props.result)
            .build();
    }

    private createFilterElement(doc: Document): Element {
        return new FeElementBuilder<FilterParams>(this.drawerUtils, 'filter')
            .setupParam('id', this.filterId)
            .setupParam('filterUnits', 'userSpaceOnUse')
            .build();
    }

    private createMorphologyElement(): Element {
        return new FeElementBuilder<FeMorphologyParams>(this.drawerUtils, 'feMorphology')
            .setupParam('in', 'SourceGraphic')
            .setupParam('operator', 'dilate')
            .setupParam('radius', 1)
            .setupParam('result', 'expand')
            .build();
    }
}

class FeElementBuilder<TParams> {
    private params: TParams;
    private elementName: string;
    private drawerUtils: DrawerUtils;
    private children: Element[];

    constructor(drawerUtils: DrawerUtils, elementName: string) {
        this.drawerUtils = drawerUtils;
        this.elementName = elementName;
        this.params = {} as TParams;
        this.children = [];
    }

    public build(): Element {
        const doc = this.drawerUtils.getDocumentElement();
        const element = doc.createElementNS(SVGNamespaceUrl, this.elementName);

        forOwn(this.params, (paramValue: any, paramName: string) => {
            if (paramValue != null) {
                element.setAttributeNS(null, paramName, paramValue.toString());
            }
        });

        each(this.children, child => {
            element.appendChild(child);
        });

        return element;
    }

    public appendChildren(children: Element[]): FeElementBuilder<TParams> {
        this.children = this.children.concat(children);
        return this;
    }

    public setupParam<TKey extends keyof TParams, TType extends TParams[TKey]>(
        paramKey: TKey,
        paramValue: TType,
    ): FeElementBuilder<TParams> {
        this.params[paramKey] = paramValue;
        return this;
    }
}

export interface FeMergeNodeParams {
    in?: string;
}

export interface FeMergeParams {
    result?: string;
}

export interface FeCompositeParams {
    operator?: string;
    result?: string;
    in2: string;
}

export interface FeFloodParams {
    'flood-color'?: string;
    'flood-opacity'?: string;
}

export interface FeOffsetParams {
    in?: string;
    dx: number;
    dy: number;
    result: string;
}

export interface FilterParams {
    id?: string;
    filterUnits?: string;
    width?: string;
    height?: string;
}

export interface FeMorphologyParams {
    operator?: string;
    radius?: number;
    in?: string;
    result?: string;
}
