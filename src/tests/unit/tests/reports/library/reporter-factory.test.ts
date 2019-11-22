// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { reporterFactory } from "reports/library/reporter-factory";
import { Reporter } from "reports/library/reporter";

describe('ReporterFactory', () => {

    it('returns a valid reporter', () => {
        const reporter = reporterFactory();

        expect(reporter).toBeInstanceOf(Reporter);
    })

});
