// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { difference, each, forOwn, isEmpty, keys, map, size } from 'lodash';
import { Mock } from 'typemoq';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import {
    FeCompositeParams,
    FeFloodParams,
    FeMergeNodeParams,
    FeMergeParams,
    FeMorphologyParams,
    FeOffsetParams,
    FilterParams,
    SVGSolidShadowFilterFactory,
} from '../../../../../injected/visualization/svg-solid-shadow-filter-factory';

describe('SVGSolidShadowFilterFactoryTest', () => {
    test('get filter', () => {
        const htmlElement = document.createElement('html');
        const filterIdPrefix = 'test-class';

        const drawerUtilsMock = Mock.ofType(DrawerUtils);
        drawerUtilsMock
            .setup(du => du.getDocumentElement())
            .returns(() => htmlElement.ownerDocument);

        const testObject = new SVGSolidShadowFilterFactory(drawerUtilsMock.object, filterIdPrefix);

        const filter = testObject.createFilter();

        let feElementIndex = 0;

        new FeElementAsserter<FilterParams>()
            .setupExpectedParam('id', `${filterIdPrefix}-solid-shadow`)
            .setupExpectedParam('filterUnits', 'userSpaceOnUse')
            .setupExpectedChildrenCount(9)
            .assertElement(filter, 'filter');

        const morphology = filter.childNodes[feElementIndex++] as Element;

        new FeElementAsserter<FeMorphologyParams>()
            .setupExpectedParam('in', 'SourceGraphic')
            .setupExpectedParam('operator', 'dilate')
            .setupExpectedParam('radius', 1)
            .setupExpectedParam('result', 'expand')
            .assertElement(morphology, 'morphology');

        const offsetProps = [
            { dx: 1, dy: 0, result: 'shadow_1', index: 1 },
            { dx: -1, dy: 0, result: 'shadow_2', index: 2 },
            { dx: 0, dy: 1, result: 'shadow_3', index: 3 },
            { dx: 0, dy: -1, result: 'shadow_4', index: 4 },
        ];

        each(offsetProps, props => {
            const offsetElement = filter.childNodes[props.index] as Element;

            new FeElementAsserter<FeOffsetParams>()
                .setupExpectedParam('in', 'expand')
                .setupExpectedParam('dx', props.dx)
                .setupExpectedParam('dy', props.dy)
                .setupExpectedParam('result', props.result)
                .assertElement(offsetElement, `feOffset: ${props.index} =>`);
        });

        feElementIndex += size(offsetProps);

        const shadowMerge = filter.childNodes[feElementIndex++] as Element;

        new FeElementAsserter<FeMergeParams>()
            .setupExpectedParam('result', 'shadow')
            .setupExpectedChildrenCount(size(offsetProps) + 1)
            .assertElement(shadowMerge, 'merge (shadow)');

        const shadowMergeNodeIns = map(offsetProps, 'result');
        shadowMergeNodeIns.push('expand');

        each(shadowMergeNodeIns, (value, index) => {
            const mergeNode = shadowMerge.childNodes[index] as Element;

            new FeElementAsserter<FeMergeNodeParams>()
                .setupExpectedParam('in', value)
                .assertElement(mergeNode, `merge node index ${index}`);
        });

        const flood = filter.childNodes[feElementIndex++] as Element;

        new FeElementAsserter<FeFloodParams>()
            .setupExpectedParam('flood-color', 'white')
            .assertElement(flood, 'flood');

        const composite = filter.childNodes[feElementIndex++] as Element;

        new FeElementAsserter<FeCompositeParams>()
            .setupExpectedParam('result', 'shadow')
            .setupExpectedParam('in2', 'shadow')
            .setupExpectedParam('operator', 'in')
            .assertElement(composite, 'composite');

        const finalMerge = filter.childNodes[feElementIndex++] as Element;

        new FeElementAsserter<FeMergeParams>()
            .setupExpectedChildrenCount(2)
            .assertElement(finalMerge, 'merge (final)');

        const finalMergeNodeIns = ['shadow', 'SourceGraphic'];

        each(finalMergeNodeIns, (value, index) => {
            const mergeNode = finalMerge.childNodes[index] as Element;

            new FeElementAsserter<FeMergeNodeParams>()
                .setupExpectedParam('in', value)
                .assertElement(mergeNode, `merge node index ${index}`);
        });
    });
});

class FeElementAsserter<TParams> {
    private expectedParams: TParams;
    private expectedChildrenCount: number = null;

    constructor() {
        this.expectedParams = {} as TParams;
    }

    public setupExpectedParam<TKey extends keyof TParams, TType extends TParams[TKey]>(
        paramKey: TKey,
        paramValue: TType,
    ): FeElementAsserter<TParams> {
        this.expectedParams[paramKey] = paramValue;
        return this;
    }

    public setupExpectedChildrenCount(count: number): FeElementAsserter<TParams> {
        this.expectedChildrenCount = count;
        return this;
    }

    public assertElement(actualElement: Element, messageSuffix?: string): void {
        this.assertElementIsNotNullOrUndefined(actualElement, messageSuffix);

        const actualElementAttributeNames = map(actualElement.attributes, 'name');
        const expectedAttributeNames = keys(this.expectedParams);

        this.assertThereAreNoUnexpectedAttributes(
            actualElementAttributeNames,
            expectedAttributeNames,
            messageSuffix,
        );
        this.assertThereAreNotMissingAttributes(
            actualElementAttributeNames,
            expectedAttributeNames,
            messageSuffix,
        );

        this.assertAttributeValuesAreAsExpected(actualElement, messageSuffix);

        this.assertChildrenCountIsAsExpected(actualElement, messageSuffix);
    }

    private assertChildrenCountIsAsExpected(actualElement: Element, messageSuffix: string): void {
        const expectedChildrenCount =
            this.expectedChildrenCount != null ? this.expectedChildrenCount : 0;
        expect(actualElement.childElementCount).toEqual(expectedChildrenCount);
    }

    private assertAttributeValuesAreAsExpected(
        actualElement: Element,
        messageSuffix: string,
    ): void {
        forOwn(this.expectedParams, (value, name) => {
            const actualValue = actualElement.getAttributeNS(null, name);
            expect(actualValue).toEqual(value.toString());
        });
    }

    private assertThereAreNoUnexpectedAttributes(
        actualElementAttributeNames: string[],
        expectedAttributeNames: string[],
        messageSuffix: string,
    ): void {
        const actualButNotExpected = difference(
            actualElementAttributeNames,
            expectedAttributeNames,
        );

        if (!isEmpty(actualButNotExpected)) {
            const extraAttributes = actualButNotExpected.join(', ');
            const message = this.prependIfNotNull(
                messageSuffix,
                `found the following unexpected attributes: <${extraAttributes}>`,
            );
            expect(message).toBeFalsy();
        }
    }

    private assertThereAreNotMissingAttributes(
        actualElementAttributeNames: string[],
        expectedAttributeNames: string[],
        messageSuffix: string,
    ): void {
        const expectedButNotPresent = difference(
            expectedAttributeNames,
            actualElementAttributeNames,
        );

        if (!isEmpty(expectedButNotPresent)) {
            const missingAttributes = expectedButNotPresent.join(', ');
            expect(
                `the following expected attributes are missing: <${missingAttributes}>`,
            ).toBeFalsy();
        }
    }

    private assertElementIsNotNullOrUndefined(actualElement: Element, messageSuffix: string): void {
        expect(actualElement).toBeDefined();
    }

    private prependIfNotNull(message: string, suffix: string): string {
        if (suffix != null) {
            return `${suffix} ${message}`;
        }

        return message;
    }
}
