//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { colors: [] };

    /** @type {Array<{ value: string }>} */
    let colors = oldState.colors;

    updateColorList(colors);

    document.querySelector('.add-color-button').addEventListener('click', () => {
        addColor();
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'addColor':
                {
                    addColor();
                    break;
                }
            case 'clearColors':
                {
                    colors = [];
                    updateColorList(colors);
                    break;
                }

        }
    });

    /**
     * @param {Array<{ value: string }>} colors
     */
    function updateColorList(colors) {
        const ul = document.querySelector('.color-list');
        ul.textContent = '';
        for (const color of colors) {
            const li = document.createElement('li');
            li.className = 'color-entry';

            const colorPreview = document.createElement('div');
            colorPreview.className = 'color-preview';
            colorPreview.style.backgroundColor = `#${color.value}`;
            colorPreview.addEventListener('click', () => {
                onColorClicked(color.value);
            });
            li.appendChild(colorPreview);

            const input = document.createElement('input');
            input.className = 'color-input';
            input.type = 'text';
            input.value = color.value;
            input.addEventListener('change', (e) => {
                const value = e.target.value;
                if (!value) {
                    // Treat empty value as delete
                    colors.splice(colors.indexOf(color), 1);
                } else {
                    color.value = value;
                }
                updateColorList(colors);
            });
            li.appendChild(input);

            ul.appendChild(li);
        }

        // Update the saved state
        vscode.setState({ colors: colors });
    }

    /** 
     * @param {string} color 
     */
    function onColorClicked(color) {
        vscode.postMessage({ type: 'colorSelected', value: color });
    }

    /**
     * @returns string
     */
    function getNewCalicoColor() {
        const colors = ['020202', 'f1eeee', 'a85b20', 'daab70', 'efcb99'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function addColor() {
        const warningMessage = 'This action is irreversible. Do you want to continue?';

  // Show a warning message dialog with a Yes/No prompt
  vscode.window.showWarningMessage(warningMessage, { modal: true }, 'Yes', 'No')
    .then((choice) => {
      if (choice === 'Yes') {
        // User clicked "Yes", continue execution
        executeScript();
      } else {
        // User clicked "No" or closed the dialog, do nothing
        return;
      }
    });
}

function executeScript() {
  // Your script execution logic goes here
  // This is where you can implement the functionality
  // that should be executed after the user confirms the warning
  vscode.window.showInformationMessage('Script execution started...');
  // ...rest of your script code...
  vscode.window.showInformationMessage('Script execution completed.');
}

module.exports = {
    activate(context) {
      // Register the command that triggers the warning and prompt
      let disposable = vscode.commands.registerCommand('extension.showWarningAndPrompt', showWarningAndPrompt);
  
      context.subscriptions.push(disposable);
    }
  };
   