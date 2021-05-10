// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

type TokenToContentRecordDictionary = { [messageToken: string]: ContentRecord };

type ContentRecord = {
    content: string;
    timestamp: Date;
};

export class PostMessageContentRepository {
    private contentRepository: TokenToContentRecordDictionary = {};
    public static maxAgeOfContentRecordInMilliseconds = 60000; // 1 minute

    constructor(private readonly dateGetter: () => Date) {}

    public storeContent = (messageToken: string, content: string): void => {
        const timestamp: Date = this.dateGetter();
        const contentRecord: ContentRecord = {
            content,
            timestamp,
        };

        this.contentRepository[messageToken] = contentRecord;
    };

    public popContent(messageToken: string): string {
        const contentRecord = this.contentRepository[messageToken];

        if (contentRecord === undefined) {
            throw new Error('Could not find content for specified token');
        }

        const timeOfRetrieveRequest: Date = this.dateGetter();
        delete this.contentRepository[messageToken];

        const ageOfContentRecord: number =
            timeOfRetrieveRequest.getTime() - contentRecord.timestamp.getTime();
        if (ageOfContentRecord > PostMessageContentRepository.maxAgeOfContentRecordInMilliseconds) {
            throw new Error('Content for specified token was stale');
        }

        return contentRecord.content;
    }
}
