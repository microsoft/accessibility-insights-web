// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportInstanceField } from 'assessments/types/report-instance-field';
import { BagOf } from 'common/types/property-bag/column-value-bag';

import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';

describe('ReportInstanceField', () => {
    type Bag = { one?: string; two?: string; attr?: BagOf<string> };
    const oneAndTwo = { one: '1', two: '2' };

    describe('common fields', () => {
        const instance = {
            description: 'my description',
            html: '<p>My HTML</p>',
            target: ['many', 'parts', 'of', 'the', 'path'],
        };

        const cases: [ReportInstanceField, string, string, string][] = [
            [ReportInstanceField.common.comment, 'comment', 'Comment', 'my description'],
            [ReportInstanceField.common.snippet, 'snippet', 'Snippet', '<p>My HTML</p>'],
            [ReportInstanceField.common.path, 'path', 'Path', 'many, parts, of, the, path'],
        ];
        cases.forEach(([field, key, label, expected]) =>
            describe(key, () => {
                it('returns key', () => {
                    expect(field.key).toEqual(key);
                });

                it('returns label', () => {
                    expect(field.label).toEqual(label);
                });

                it('returns value', () => {
                    expect(field.getValue(instance)).toEqual(expected);
                });

                it('returns null for missing value', () => {
                    expect(field.getValue({})).toBeUndefined();
                });
            }),
        );
    });

    describe('fromPropertyBagField', () => {
        const field = ReportInstanceField.fromPropertyBagField<Bag>('One', 'one');

        it('returns key', () => {
            expect(field.key).toEqual('one');
        });

        it('returns label', () => {
            expect(field.label).toEqual('One');
        });

        it('returns value', () => {
            expect(field.getValue({ propertyBag: { one: '42' } })).toEqual('42');
        });

        it('returns null for missing value', () => {
            expect(field.getValue({ propertyBag: {} })).toBeUndefined();
        });

        it('returns undefined for missing property bag', () => {
            expect(field.getValue({} as any)).toBeUndefined();
        });
    });

    describe('fromColumnValueBagField without default value set', () => {
        const field = ReportInstanceField.fromColumnValueBagField<Bag>('One', 'one');

        it('returns key', () => {
            expect(field.key).toEqual('one');
        });

        it('returns label', () => {
            expect(field.label).toEqual('One');
        });

        it('returns value', () => {
            expect(field.getValue({ propertyBag: { one: '42' } })).toEqual('42');
        });

        it('returns nested property bag', () => {
            expect(field.getValue({ propertyBag: { one: { two: '42' } } })).toEqual({ two: '42' });
        });

        it('returns - for missing value by default', () => {
            expect(field.getValue({ propertyBag: {} })).toEqual('-');
        });
    });

    describe('fromColumnValueBagField with default value set', () => {
        const field = ReportInstanceField.fromColumnValueBagField<Bag>('One', 'one', 'x');

        it('returns - for missing value by default', () => {
            expect(field.getValue({ propertyBag: {} })).toEqual('x');
        });
    });

    describe('fromPropertyBagFunction', () => {
        const field = ReportInstanceField.fromPropertyBagFunction<Bag>(
            'Three',
            'three',
            b => b.one + ' + ' + b.two,
        );

        it('returns key', () => {
            expect(field.key).toEqual('three');
        });

        it('returns label', () => {
            expect(field.label).toEqual('Three');
        });

        it('returns value', () => {
            expect(field.getValue({ propertyBag: oneAndTwo })).toEqual('1 + 2');
        });

        it('returns undefined for missing property bag', () => {
            expect(field.getValue({} as any)).toBeUndefined();
        });
    });

    describe('fromColumns', () => {
        describe('string columns', () => {
            const configs: PropertyBagColumnRendererConfig<Bag>[] = [
                {
                    propertyName: 'one',
                    displayName: 'Field one',
                },
                {
                    propertyName: 'two',
                    displayName: 'Field two',
                    defaultValue: '(empty)',
                },
            ];

            const fields = ReportInstanceField.fromColumns(configs);
            const [one, two] = fields;

            test('returns proper labels', () => {
                expect(one.label).toEqual('Field one');
                expect(two.label).toEqual('Field two');
            });

            test('returns present values', () => {
                expect(one.getValue({ propertyBag: oneAndTwo })).toEqual('1');
                expect(two.getValue({ propertyBag: oneAndTwo })).toEqual('2');
            });

            test('handles missing values properly', () => {
                const bag = {};

                expect(one.getValue({ propertyBag: bag })).toBeUndefined();
                expect(two.getValue({ propertyBag: bag })).toEqual('(empty)');
            });
        });

        describe('property bag columns', () => {
            type BagWithAttributes = { attr: BagOf<string> };
            const empty = {};

            const config: PropertyBagColumnRendererConfig<BagWithAttributes> = {
                propertyName: 'attr',
                displayName: 'Attributes',
            };

            it('returns undefined default', () => {
                const [field] = ReportInstanceField.fromColumns([config]);
                expect(field.getValue(empty)).toBeUndefined();
            });

            it('returns string default', () => {
                const defaultValue = '(empty)';

                const [field] = ReportInstanceField.fromColumns([{ ...config, defaultValue }]);
                expect(field.getValue(empty)).toEqual(defaultValue);
            });

            it('returns bag default', () => {
                const defaultValue = { prop: 'bag' };

                const [field] = ReportInstanceField.fromColumns([{ ...config, defaultValue }]);
                expect(field.getValue(empty)).toEqual(defaultValue);
            });

            it('returns default on empty bag', () => {
                const defaultValue = '(empty)';
                const inst = { propertyBag: { attr: empty } };

                const [field] = ReportInstanceField.fromColumns([{ ...config, defaultValue }]);
                expect(field.getValue(inst)).toEqual(defaultValue);
            });

            test('returns inner bag', () => {
                const innerBag = { first: '1st', second: '2nd' };
                const inst = { propertyBag: { attr: innerBag } };

                const [field] = ReportInstanceField.fromColumns([config]);
                expect(field.getValue(inst)).toEqual(innerBag);
            });
        });
    });

    describe('fromSnippet', () => {
        const key = 'property-key';
        const label = 'Property label';

        it('sets key and label', () => {
            const field = ReportInstanceField.fromSnippet(key, label);

            expect(field.key).toBe(key);
            expect(field.label).toBe(label);
        });

        it('returns html', () => {
            const htmlSnippet = 'html snippet';
            const instanceStub = { html: htmlSnippet };

            const field = ReportInstanceField.fromSnippet(key, label);

            expect(field.getValue(instanceStub)).toBe(htmlSnippet);
        });
    });
});
