import { ReportFileNameGenerator } from '../../../../../../DetailsView/reports/components/report-file-name-generator';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

describe('ReportFileNameGenerator', () => {
    const theDate = new Date(Date.UTC(2019, 2, 12, 16, 0, 0));
    const theBase = 'BASE';
    const theExt = 'EXT';
    const expectedFileName = 'BASE 2019-03-12 16:00:00.EXT';

    it('generates an appropriate file from the current date/time', () => {
        const dateProvider = () => theDate;
        const deps = { dateProvider };
        const generator = new ReportFileNameGenerator(deps);

        const fileName = generator.getFileName(theBase, theExt);

        expect(fileName).toBe(expectedFileName);
    });
});
