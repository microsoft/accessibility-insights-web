import { ManualTestStatus } from '../../../common/types/manual-test-status';
import { OutcomeStats } from '../../reports/components/outcome-type';


export const getStatusForTest = (stats: OutcomeStats): ManualTestStatus => {
    if (stats.incomplete > 0) {
        return ManualTestStatus.UNKNOWN;
    }
    else if (stats.fail > 0) {
        return ManualTestStatus.FAIL;
    }
    else {
        return ManualTestStatus.PASS;
    }
};
