// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingService } from './types/issue-filing-service';

export class BugFilingServiceProvider {
    constructor(private readonly services: BugFilingService[]) {}
    public all(): BugFilingService[] {
        return this.services.slice();
    }

    public allVisible(): BugFilingService[] {
        return this.all().filter(service => !service.isHidden);
    }

    public forKey(key: string): BugFilingService {
        return this.all().find(service => service.key === key);
    }
}
