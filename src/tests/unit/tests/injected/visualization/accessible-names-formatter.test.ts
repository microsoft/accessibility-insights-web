// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerConfiguration } from 'injected/visualization/formatter';
import { AccessibleNamesFormatter } from '../../../../../injected/visualization/accessible-names-formatter';

describe(AccessibleNamesFormatter, () => {
    let testSubject: AccessibleNamesFormatter;
    beforeEach(() => {
        testSubject = new AccessibleNamesFormatter();
    });

    it('should not provide a dialog renderer', () => {
        expect(testSubject.getDialogRenderer()).toBeNull();
    });

    it('should use the expected formatting without truncating the name for accessible names of length <= 40 characters', () => {
        const name = 'this value is exactly 40 characters long';
        const data = buildData(name);
        const config = testSubject.getDrawerConfiguration(null!, data);
        testStyling(config, name);
    });

    it('should use the expected formatting and truncate the name for accessible names of length > 40 characters', () => {
        const name = 'this value takes up exactly 41 characters';
        const truncatedName = 'this value takes up exactly 41 character...';
        const data = buildData(name);
        const config = testSubject.getDrawerConfiguration(null!, data);
        testStyling(config, truncatedName);
    });

    it('should not show a visualization for null data', () => {
        const config = testSubject.getDrawerConfiguration(null!, null);

        expect(config).toEqual({ showVisualization: false });
    });

    it('should not show a visualization for a result missing the display-accessible-names rule', () => {
        const data = buildData('irrelevant', false);
        const config = testSubject.getDrawerConfiguration(null!, data);

        expect(config).toEqual({ showVisualization: false });
    });

    it('should not show a visualization for a result missing the display-accessible-names check', () => {
        const data = buildData('irrelevant', true, false);
        const config = testSubject.getDrawerConfiguration(null!, data);

        expect(config).toEqual({ showVisualization: false });
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
        accessibleName: string,
        withRule: boolean = true,
        withCheck: boolean = true,
    ): AssessmentVisualizationInstance {
        const data: AssessmentVisualizationInstance = {
            target: ['html'],
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: {},
        };

        if (withRule) {
            const rule = {
                any: [],
                none: [],
                all: [],
                status: true,
                ruleId: 'display-accessible-names',
                selector: 'selector',
                guidanceLinks: [],
            };

            if (withCheck) {
                rule.any = [
                    {
                        id: 'display-accessible-names',
                        message: 'message for none-check1',
                        data: {
                            accessibleName: accessibleName,
                        },
                    },
                ];
            }

            data.ruleResults['display-accessible-names'] = rule;
        }

        return data;
    }
});
