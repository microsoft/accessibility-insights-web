// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';

import { PivotConfiguration } from '../../../../../../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../../../../../../common/configs/visualization-configuration-factory';
import { DetailsViewPivotType } from '../../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { NavLinkForLeftNav } from '../../../../../../DetailsView/components/details-view-left-nav';
import { getTestLinks } from '../../../../../../DetailsView/components/left-nav/links-provider';

describe('getLinksTest', () => {
    type TestCase = {
        config: any;
        expectedTitle: string
    };
    const testCases: TestCase[] = [
        {
            config: {
                displayableData: { title: 'test title' },
            },
            expectedTitle: 'test title',
        },
        {
            config: {
                displayableData: null,
            },
            expectedTitle: 'NO TITLE FOUND',
        }];

    test.each(testCases)('getLinks - %o', (testCase: TestCase) => {
        const type = DetailsViewPivotType.fastPass;
        const onClickStub = () => { };

        const pivotConfiguration: VisualizationType[] = [
            VisualizationType.Headings,
            VisualizationType.Landmarks,
        ];

        const pivotConfigurationMock = Mock.ofType<PivotConfiguration>();
        pivotConfigurationMock
            .setup(config => config.getTestsByType(type))
            .returns(() => pivotConfiguration);

        const visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationFactoryMock
            .setup(factory => factory.getConfiguration(It.isAny()))
            .returns(() => testCase.config);

        const result = getTestLinks(type, pivotConfigurationMock.object, visualizationConfigurationFactoryMock.object, onClickStub);

        result.forEach((navLink: NavLinkForLeftNav, index) => {
            expect(navLink.name).toEqual(testCase.expectedTitle);
            expect(navLink.key).toEqual(VisualizationType[pivotConfiguration[index]]);
            expect(navLink.forceAnchor).toBe(true);
            expect(navLink.url).toBe('');
            expect(navLink.index).toEqual(index + 1);
            expect(navLink.onRenderNavLink(navLink, () => null)).toMatchSnapshot(`${testCase.expectedTitle} index=${index}`);
            expect(navLink.iconProps.className).toBe('hidden');
            expect(navLink.onClickNavLink).toEqual(onClickStub);
        });
    });
});
