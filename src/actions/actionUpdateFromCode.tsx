import { clipboard } from "../components/icons";
import { ToolButton } from "../components/ToolButton";
import { getSelectedElements } from "../scene";
import { register } from "./register";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const actionUpdateFromCode = register({
  name: "updateFromCode",
  perform: (elements, appState, { copied }) => {
    if (copied) {
      return {
        appState: {
          ...appState,
          toastMessage: `Copied ${copied} to clipboard`,
        },
        elements,
        commitToHistory: false,
      };
    }
    return { elements, appState, commitToHistory: false };
  },
  contextItemLabel: "labels.updateFromCode",
  PanelComponent: ({ elements, appState, updateData }) => {
    const selectedElement = getSelectedElements(elements, appState)[0];

    return (
      <fieldset>
        <legend>Interact through code</legend>
        <div>
          <div>
            <code>
              <span>id: </span>
              <span style={{ userSelect: "text" }}>{selectedElement.id}</span>
            </code>
            <CopyToClipboard
              text={selectedElement.id}
              onCopy={() => {
                updateData({ copied: selectedElement.id });
              }}
            >
              <div className="buttonList" style={{ display: "inline-block" }}>
                <div style={{ marginLeft: "4px" }}>
                  <ToolButton
                    icon={clipboard}
                    title="Copy id to clipboard"
                    aria-label="Copy id to clipboard"
                    type="button"
                  />
                </div>
              </div>
            </CopyToClipboard>
          </div>
          <a
            href="https://pypi.org/project/databutton/"
            style={{ fontSize: "0.8rem" }}
            target="_blank"
            rel="noreferrer"
            aria-label="databutton python docs"
          >
            See python documentation here
          </a>
        </div>
      </fieldset>
    );
  },
});
