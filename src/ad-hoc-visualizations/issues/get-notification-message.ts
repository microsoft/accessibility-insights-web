// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { isEmpty } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';

export const getNotificationMessage = (
    selectorMap: DictionaryStringTo<any>,
    warnings: ScanIncompleteWarningId[],
) => {
    const iframeCoda =
        '\nThere are iframes in the target page. Use FastPass or Assessment to provide additional permissions.';

    if (isEmpty(selectorMap)) {
        if (isEmpty(warnings)) {
            return 'Congratulations!\n\nAutomated checks found no issues on this page.';
        }

        return `No automated checks issues found.${iframeCoda}`;
    }

    const issuesFound = 'Automated checks found issues.';

    if (isEmpty(warnings)) {
        return issuesFound;
    }

    return `${issuesFound}${iframeCoda}`;
};
