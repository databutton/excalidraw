import SetTableNameDialog from "../components/SetTableNameDialog";
import { duplicateElement, getNonDeletedElements } from "../element";
import { ExcalidrawTableElement, FileId } from "../element/types";
import { t } from "../i18n";
import { randomId } from "../random";
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
    // Dummy file with new name
    const newExtraFile = new File([], data.title!);
    const newDataUrl = await generator(newExtraFile);
    const fileId: FileId = (
      app.props.generateIdForFile
        ? await app.props.generateIdForFile(newExtraFile)
        : randomId()
    ) as FileId;
    const newElement = duplicateElement(null, new Map(), element, {
      fileId,
      tableId: element.tableId || element.fileId,
    });
    const newFile = {
      ...existingFile,
      id: fileId,
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
      elements: [...elements.filter((e) => e.id !== element.id), newElement],
      commitToHistory: true,
      files: { ...app.files, [newElement.fileId as string]: newFile },
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
