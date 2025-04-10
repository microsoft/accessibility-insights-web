export const addCopyToClipboardListener = function (doc: Document): void {
    const copyToClipboard = async function(instanceId: string): Promise<void> {
        const contentId = `copy-content-${instanceId.replace(/[^a-zA-Z0-9]/g, '')}`;
        const contentElement = doc.getElementById(contentId);
        const textToCopy = contentElement ? contentElement.textContent || '' : instanceId;

        try {
            await navigator.clipboard.writeText(textToCopy);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return;
        }

        const notificationId = `copy-notification-${instanceId.replace(/[^a-zA-Z0-9]/g, '')}`;
        const notificationElement = doc.getElementById(notificationId);
        if (notificationElement) {
            notificationElement.style.display = 'inline';
            setTimeout(function() {
                notificationElement.style.display = 'none';
            }, 2000);
        }
    };

    const copyButtons = doc.querySelectorAll('button[id^="copy-button-"]');
    for (let i = 0; i < copyButtons.length; i++) {
        const button = copyButtons[i];
        const buttonId = button.id;
        const instanceId = buttonId.replace('copy-button-', '');

        button.addEventListener('click', function(): void {
            void copyToClipboard(instanceId);
        });
    }
};

export const getCopyToClipboardScript = (code: string | Function): string =>
    `(${String(code)})(document)`;

export const getDefaultCopyToClipboardScript = (): string =>
    getCopyToClipboardScript(addCopyToClipboardListener);
