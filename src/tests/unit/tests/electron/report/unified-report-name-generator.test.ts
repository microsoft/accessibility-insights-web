// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedReportNameGenerator } from 'electron/views/report/unified-report-name-generator';
import { ReportNameGeneratorBuilder } from 'reports/report-name-generator-builder';
import { Mock, Times } from 'typemoq';

describe('UnifiedReportNameGenerator', () => {
    const theBase = 'BASE';
    const theTitle = 'Title';
    const theDate = new Date();

    const dateSegment = 'date segment';
    const timeSegment = 'time segment';
    const titleSegment = 'title segment';

    const reportNameGeneratorBuilderMock = Mock.ofType(ReportNameGeneratorBuilder);
    const testObject = new UnifiedReportNameGenerator(reportNameGeneratorBuilderMock.object);

    beforeEach(() => {
        reportNameGeneratorBuilderMock
            .setup(rngbm => rngbm.getDateSegment(theDate))
            .returns(() => dateSegment)
            .verifiable(Times.once());
        reportNameGeneratorBuilderMock
            .setup(rngbm => rngbm.getTimeSegment(theDate))
            .returns(() => timeSegment)
            .verifiable(Times.once());
        reportNameGeneratorBuilderMock
            .setup(rngbm => rngbm.getTitleSegment(theTitle))
            .returns(() => titleSegment)
            .verifiable(Times.once());
    });

    it('generateName', () => {
        const actual = testObject.generateName(theBase, theDate, theTitle);

        const expected = `${theBase}_${dateSegment}_${timeSegment}_${titleSegment}.html`;
        expect(actual).toEqual(expected);

        reportNameGeneratorBuilderMock.verifyAll();
    });
});
