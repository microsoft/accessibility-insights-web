// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileNameBuilder } from 'common/filename-builder';
import { WebReportNameGenerator } from 'reports/report-name-generator';
import { Mock, Times } from 'typemoq';

describe('WebReportNameGenerator', () => {
    const theBase = 'BASE';
    const theTitle = 'Title';
    const theDate = new Date();

    const dateSegment = 'date segment';
    const titleSegment = 'title segment';

    const fileNameBuilderMock = Mock.ofType(FileNameBuilder);
    const testObject = new WebReportNameGenerator(fileNameBuilderMock.object);

    beforeEach(() => {
        fileNameBuilderMock
            .setup(rngbm => rngbm.getDateSegment(theDate))
            .returns(() => dateSegment)
            .verifiable(Times.once());
        fileNameBuilderMock
            .setup(rngbm => rngbm.getTitleSegment(theTitle))
            .returns(() => titleSegment)
            .verifiable(Times.once());
    });

    it('generateName', () => {
        const actual = testObject.generateName(theBase, theDate, theTitle);

        const expected = `${theBase}_${dateSegment}_${titleSegment}.html`;
        expect(actual).toEqual(expected);

        fileNameBuilderMock.verifyAll();
    });
});
