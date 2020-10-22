// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { shallow } from 'enzyme';
import * as React from 'react';

import {
    HowToFixAndroidCardRow,
    HowToFixAndroidCardRowProps,
} from 'common/components/cards/how-to-fix-android-card-row';
import { LinkComponentType } from 'common/types/link-component-type';
import { IMock, It, Mock } from 'typemoq';
import { FixInstructionProcessor } from '../../../../../../common/components/fix-instruction-processor';

describe(HowToFixAndroidCardRow, () => {
    let fixInstructionProcessorMock: IMock<FixInstructionProcessor>;
    beforeEach(() => {
        fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);

        fixInstructionProcessorMock.setup(f => f.process(It.isAnyString())).returns(str => str);
    });
    it('renders with matches', () => {
        const props: HowToFixAndroidCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                formatAsCode: ["isn't", 'notPresent', 'bold'],
                howToFix:
                    "This isn't a simple text. It has some words that will be marked as bold.",
            },
        };

        const testSubject = shallow(<HowToFixAndroidCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test.each([null, undefined])('renders when howToFix is empty. - %o', howToFixValue => {
        const props: HowToFixAndroidCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                formatAsCode: ["isn't", 'notPresent', 'bold'],
                howToFix: howToFixValue,
            },
        };

        const testSubject = shallow(<HowToFixAndroidCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test.each([null, undefined])('throws when match has empty strings - %o', value => {
        const props: HowToFixAndroidCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                formatAsCode: [value],
                howToFix:
                    "This isn't a simple text. It has some words that will be marked as bold.",
            },
        };

        expect(() => shallow(<HowToFixAndroidCardRow {...props} />)).toThrow();
    });

    type RenderWithSpaceTestCase = {
        label: string;
        formatAsCode?: string[];
        howToFix: string;
    };

    const renderWithSpaceTestCases: RenderWithSpaceTestCase[] = [
        {
            label: 'when string starts with space',
            howToFix: ' This is a sample string',
        },
        {
            label: 'when string ends with space',
            howToFix: 'This is a sample string ',
        },
        {
            label: 'when match is within a word',
            formatAsCode: ['amp'],
            howToFix: 'This is a sample string ',
        },
        {
            label: 'when match is on a word',
            formatAsCode: ['sample'],
            howToFix: 'This is a sample string ',
        },
    ];
    renderWithSpaceTestCases.forEach(testCase => {
        it(`renders with whitespace - ${testCase.label}`, () => {
            const props: HowToFixAndroidCardRowProps = {
                deps: {
                    fixInstructionProcessor: fixInstructionProcessorMock.object,
                    LinkComponent: {} as LinkComponentType,
                },
                index: 22,
                propertyData: {
                    formatAsCode: testCase.formatAsCode,
                    howToFix: testCase.howToFix,
                },
            };

            const testSubject = shallow(<HowToFixAndroidCardRow {...props} />);

            expect(testSubject.getElement()).toMatchSnapshot();
        });
    });

    it('renders without formatAsCode property', () => {
        const props: HowToFixAndroidCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                howToFix:
                    "This isn't a simple text. It has some words that will be marked as bold.",
            },
        };

        const testSubject = shallow(<HowToFixAndroidCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders when matches are not found', () => {
        const props: HowToFixAndroidCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                formatAsCode: ["isn'T", 'notPresent', 'bold1'],
                howToFix:
                    "This isn't a simple text. It has some words that will be marked as bold.",
            },
        };

        const testSubject = shallow(<HowToFixAndroidCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders with colors', () => {
        fixInstructionProcessorMock.reset();
        fixInstructionProcessorMock
            .setup(f => f.process(It.isAnyString()))
            .returns(str => <>replaced-color</>);

        const props: HowToFixAndroidCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                formatAsCode: ["isn't", 'notPresent', 'bold'],
                howToFix:
                    "This isn't a simple text. It has some words that will be marked as bold.",
            },
        };

        const testSubject = shallow(<HowToFixAndroidCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
