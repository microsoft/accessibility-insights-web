// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileNameBuilder } from 'common/filename-builder';
import { UnifiedReportNameGenerator } from 'electron/views/report/unified-report-name-generator';
import { Mock, Times } from 'typemoq';

describe('UnifiedReportNameGenerator', () => {
    const theBase = 'BASE';
    const theTitle = 'Title';
    const theDate = new Date();

    const dateSegment = 'date segment';
    const timeSegment = 'time segment';
    const titleSegment = 'title segment';

    const fileNameBuilderMock = Mock.ofType(FileNameBuilder);
    const testObject = new UnifiedReportNameGenerator(fileNameBuilderMock.object);

    beforeEach(() => {
        fileNameBuilderMock
            .setup(rngbm => rngbm.getDateSegment(theDate))
            .returns(() => dateSegment)
            .verifiable(Times.once());
        fileNameBuilderMock
            .setup(rngbm => rngbm.getTimeSegment(theDate))
            .returns(() => timeSegment)
            .verifiable(Times.once());
        fileNameBuilderMock
            .setup(rngbm => rngbm.getTitleSegment(theTitle))
            .returns(() => titleSegment)
            .verifiable(Times.once());
    });

    it('generateName', () => {
        const actual = testObject.generateName(theBase, theDate, theTitle);

        const expected = `${theBase}_${dateSegment}_${timeSegment}_${titleSegment}.html`;
        expect(actual).toEqual(expected);

        fileNameBuilderMock.verifyAll();
    });
});
