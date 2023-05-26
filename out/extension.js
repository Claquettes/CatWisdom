"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const provider = new ColorsViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));
}
exports.activate = activate;
class ColorsViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    _getHtmlForWebview(webview) {
        const catArray = [
            'cat2.png',
            'cat3.png',
            'cat4.png',
            'cat5.jpg',
            'cat6.png',
            'cat7.png',
            'cat8.png',
            'cat9.png',
            'cat10.png',
            'cat11.png',
        ];
        const generateRandomCatPath = () => {
            const catIndex = Math.floor(Math.random() * catArray.length);
            return webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', catArray[catIndex]));
        };
        const catPath = generateRandomCatPath();
        const citationArray = [
            'Coding like poetry should be short and concise. <br> <strong> Shawn Wildermuth </strong>',
            'It’s not a bug; it’s an undocumented feature. <br> <strong> Anonymous </strong>',
            'First, solve the problem. Then, write the code. <br> <strong> John Johnson </strong>',
            'Code is like humor. When you have to explain it, it’s bad. <br> <strong> Cory House </strong>',
            'Fix the cause, not the symptom. <br> <strong> Steve Maguire </strong>',
            'Optimism is an occupational hazard of programming: feedback is the treatment. <br> <strong> Kent Beck </strong>',
            'Make it work, make it right, make it fast. <br> <strong> Kent Beck </strong>',
            'Clean code always looks like it was written by someone who cares. <br> <strong> Michael Feathers </strong>',
            'Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. <br> <strong> Rick Osborne </strong>',
            'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. <br> <strong> Martin Fowler </strong>',
            'Programming is the art of telling another human being what one wants the computer to do. <br> <strong> Donald Knuth </strong>',
            'Software is like sex: it’s better when it’s free. <br> <strong> Linus Torvalds </strong>',
        ];
        const generateRandomCitation = () => {
            const citationIndex = Math.floor(Math.random() * citationArray.length);
            return citationArray[citationIndex];
        };
        const citation = generateRandomCitation();
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} ${catPath};">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Cat Colors</title>
			</head>
			<body>
				<div id="cats">
					<img id="cat" src="${catPath}">
				</div>
				<div id="citation">
					${citation}
				</div>
			</body>
			</html>`;
    }
}
ColorsViewProvider.viewType = 'CatWisdom.colorsView';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map