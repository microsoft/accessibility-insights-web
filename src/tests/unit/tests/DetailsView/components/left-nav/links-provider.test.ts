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
    const testData = [
        [
            {
                displayableData: { title: 'test title' },
            },
            'test title',
        ],
        [
            {
                displayableData: null,
            },
            'NO TITLE FOUND',
        ],
    ];

    test.each(testData)('getLinks', (configuration, expectedTitle) => {
        const type = DetailsViewPivotType.fastPass;
        const onClickStub = () => {};

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
            .returns(() => configuration);

        const result = getTestLinks(type, pivotConfigurationMock.object, visualizationConfigurationFactoryMock.object, onClickStub);

        result.forEach((navLink: NavLinkForLeftNav, index) => {
            expect(navLink.name).toEqual(expectedTitle);
            expect(navLink.key).toEqual(VisualizationType[pivotConfiguration[index]]);
            expect(navLink.forceAnchor).toBe(true);
            expect(navLink.url).toBe('');
            expect(navLink.index).toEqual(index + 1);
            expect(navLink.onRenderNavLink(navLink, () => null)).toMatchSnapshot(`${expectedTitle} index=${index}`);
            expect(navLink.iconProps.className).toBe('hidden');
            expect(navLink.onClickNavLink).toEqual(onClickStub);
        });
    });
});
