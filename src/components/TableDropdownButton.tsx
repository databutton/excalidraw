import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import "./TableDropdownButton.scss";
import { ToolButton, ToolButtonProps } from "./ToolButton";

type Props = ToolButtonProps & {
  onNewTable: () => void;
  onUploadCSV: () => void;
};
const TableDropdownButton: React.FC<Props> = ({
  icon,
  title,
  keyBindingLabel,
  label,
  onNewTable,
  onUploadCSV,
  ...rest
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClick = (e: any) => {
      if (
        popperElement?.contains(e.target) ||
        referenceElement?.contains(e.target)
      ) {
        return;
      }
      setDropdownVisible(false);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [referenceElement, popperElement, setDropdownVisible]);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const dropdown = (
    <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        className="table-dropdown"
      >
        <div
          className="item"
          onClick={(e) => {
            e.preventDefault();
            onUploadCSV();
            setDropdownVisible(false);
          }}
        >
          Upload CSV
        </div>
        <hr />
        <div
          className="item"
          onClick={(e) => {
            e.preventDefault();
            onNewTable();
            setDropdownVisible(false);
          }}
        >
          New table
        </div>
      </div>
      {/* <Island padding={1} style={{ minWidth: "200px" }}>
        <Stack.Row gap={1}>
          <Stack.Col style={{ width: "100%" }}>Upload CSV</Stack.Col>
        </Stack.Row>
        <Stack.Row gap={1}>New table</Stack.Row>
      </Island> */}
      <div ref={setArrowElement} style={styles.arrow} />
    </div>
  );
  return (
    <>
      <ToolButton
        className="Shape"
        ref={setReferenceElement}
        key="table"
        type={"button"}
        onClick={(e) => {
          if (popperElement?.contains(e.target as any)) {
            return;
          }
          setDropdownVisible(true);
        }}
        icon={icon}
        name="editor-current-shape"
        title={title}
        keyBindingLabel={keyBindingLabel}
        aria-label={rest["aria-label"]}
        aria-keyshortcuts={rest["aria-keyshortcuts"]}
        data-testid={rest["data-testid"]}
        // onChange={({ pointerType }) => {
        //   setAppState({
        //     elementType: value,
        //     multiElement: null,
        //     selectedElementIds: {},
        //   });
        //   setCursorForShape(canvas, value);
        //   if (value === "image") {
        //     onImageAction({ pointerType });
        //   }
        //   if (value === "table") {
        //     onTableAction({ pointerType });
        //   }
        // }}
      />
      {dropdownVisible && dropdown}
    </>
  );
};

export default TableDropdownButton;
