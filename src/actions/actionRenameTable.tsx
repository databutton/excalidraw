import SetTableNameDialog from "../components/SetTableNameDialog";
import { getNonDeletedElements } from "../element";
import { ExcalidrawTableElement } from "../element/types";
import { t } from "../i18n";
import { getSelectedElements } from "../scene";
import { BinaryFileData } from "../types";
import { register } from "./register";

export const actionToggleRenameTableDialog = register({
  name: "toggleRenameTableDialog",
  perform(elements, appState) {
    return {
      appState: {
        ...appState,
        showRenameTableDialog: !this.checked!(appState),
      },
      commitToHistory: false,
    };
  },
  checked: (appState) => appState.showRenameTableDialog,
  contextItemLabel: "labels.renameTable",
  contextItemPredicate: (elements, appState) => {
    const eligibleElements = getSelectedElements(
      getNonDeletedElements(elements),
      appState,
    );
    return (
      eligibleElements.length === 1 && eligibleElements[0].type === "table"
    );
  },
});

export const actionRenameTable = register({
  name: "renameTable",
  perform: async (elements, appState, data, app) => {
    if (data.close || !data.title) {
      return {
        appState: {
          ...appState,
          pendingNewTablename: null,
          showRenameTableDialog: false,
        },
        commitToHistory: false,
      };
    }
    const element = elements.find(
      (el) => appState.selectedElementIds[el.id] && el.type === "table",
    ) as ExcalidrawTableElement;
    if (!element || !element.fileId) {
      return false;
    }
    const existingFile = app.files[element.fileId!];
    const generator = app.props.generateThumbnailForTable;
    if (!generator) {
      return false;
    }
    const newExtraFile = {
      ...existingFile.extraFile,
      name: data.title,
    } as File;
    const newDataUrl = await generator(newExtraFile);
    const newFile = {
      ...existingFile,
      extraFile: newExtraFile,
      dataURL: newDataUrl,
    } as BinaryFileData;
    return {
      appState: {
        ...appState,
        toastMessage: t("toast.renameTable").replace("{tablename}", data.title),
        pendingNewTablename: null,
        showRenameTableDialog: false,
      },
      commitToHistory: true,
      files: { [element.fileId!]: newFile },
    };
  },
  PanelComponent: ({ updateData, data }) => {
    return (
      <SetTableNameDialog
        onCancel={() => updateData({ close: true })}
        onConfirm={(title) => {
          updateData({ title });
        }}
      />
    );
  },
});
