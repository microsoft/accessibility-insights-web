// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleScriptProvider } from '../../../../../../../DetailsView/reports/components/report-sections/collapsible-script-provider';

describe('CollapsibleScriptProvider', () => {
    it('match content', () => {
        const testObject = new CollapsibleScriptProvider();

        const result = testObject.getDefault();

        expect(result).toMatchSnapshot();
    });
});
