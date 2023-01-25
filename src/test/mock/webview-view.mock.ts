import * as vscode from 'vscode';

export const buildWebViewMock = () => ({
    onDidChangeVisibility: () => ({} as vscode.Disposable),
    onDidDispose: () => ({} as vscode.Disposable),
    show: (preserveFocus?: boolean | undefined) => undefined,
    visible: false,
    viewType: '',
    badge: undefined,
    description: undefined,
    title: undefined,
    webview: {
        asWebviewUri: (localResource: vscode.Uri) => localResource,
        onDidReceiveMessage: (e: any) => ({} as vscode.Disposable),
        postMessage: (message: any) => ({} as Thenable<boolean>),
        cspSource: '',
        html: '',
        options: {} as vscode.WebviewOptions,
    }
});