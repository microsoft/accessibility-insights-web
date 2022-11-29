// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerConfiguration } from 'injected/visualization/formatter';
import { AccessibleNamesFormatter } from '../../../../../injected/visualization/accessible-names-formatter';

describe('AccessibleNamesFormatterTests', () => {
    let testSubject: AccessibleNamesFormatter;
    const htmlElement = document.createElement('dialog');
    beforeEach(() => {
        testSubject = new AccessibleNamesFormatter();
    });

    test('verify getDialogRenderer', () => {
        expect(testSubject.getDialogRenderer()).toBeNull;
    });

    test('verify styling for accessible names shorter than 40 characters', () => {
        const name = 'test button';
        const ruleId = 'display-accessible-names';
        const Data = buildData(name, ruleId);
        const config = testSubject.getDrawerConfiguration(htmlElement, Data);
        testStyling(config, name);
    });

    test('verify styling for accessible names longer than 40 characters', () => {
        const name = 'The quick brown fox jumped over the lazy dog';
        const truncatedName = 'The quick brown fox jumped over the lazy...';
        const ruleId = 'display-accessible-names';
        const Data = buildData(name, ruleId);
        const config = testSubject.getDrawerConfiguration(htmlElement, Data);
        testStyling(config, truncatedName);
    });

    test('verify wrong rule id referenced', () => {
        const Data = buildData('button', 'display-accessible');
        const config = testSubject.getDrawerConfiguration(htmlElement, Data);
        testStyling(config, undefined);
    });

    function testStyling(Drawerconfig: DrawerConfiguration, accessibleText: string) {
        expect(Drawerconfig.outlineColor).toBe('#8D4DFF');
        expect(Drawerconfig.outlineStyle).toBe('dashed');
        expect(Drawerconfig.showVisualization).toBe(true);
        expect(Drawerconfig.textBoxConfig.fontColor).toBe('#FFFFFF');
        expect(Drawerconfig.textBoxConfig.background).toBe('#8D4DFF');
        expect(Drawerconfig.textBoxConfig.text).toBe(accessibleText);
        expect(Drawerconfig.textBoxConfig.fontWeight).toBe('400');
        expect(Drawerconfig.textBoxConfig.fontSize).toBe('10px');
    }

    function buildData(
        accessibleNameValue: string,
        ruleIdValue: string,
    ): AssessmentVisualizationInstance {
        const Data: AssessmentVisualizationInstance = {
            target: ['html'],
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: {
                'display-accessible-names': {
                    any: [
                        {
                            id: 'display-accessible-names',
                            message: 'message for none-check1',
                            data: {
                                accessibleName: accessibleNameValue,
                            },
                        },
                    ],
                    none: [],
                    all: [],
                    status: true,
                    ruleId: ruleIdValue,
                    selector: 'selector',
                    guidanceLinks: [],
                },
            },
        };
        return Data;
    }
});
