```javascript
const classic = {
    strutureSample: [],

    displayType: "popupMedium",

    cssStyles: [{
        // =================================================
        // ROOT
        // =================================================
        object: ".sort-list-root",
        info: [{
            key: "width",
            value: "100%"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // ADD AREA
        // =================================================
        object: ".sort-list-add",
        info: [{
            key: "display",
            value: "flex"
        }, {
            key: "flex-wrap",
            value: "wrap"
        }, {
            key: "width",
            value: "100%"
        }, {
            key: "align-items",
            value: "center"
        }, {
            key: "gap",
            value: "8px"
        }, {
            key: "margin-bottom",
            value: "12px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        object: ".sort-list-input",
        info: [{
            key: "flex",
            value: "1 1 0"
        }, {
            key: "min-width",
            value: "100px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        object: ".sort-list-add-button",
        info: [{
            key: "flex",
            value: "0 0 auto"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // HEADER
        // =================================================
        object: ".sort-list-header",
        info: [{
            key: "display",
            value: "flex"
        }, {
            key: "flex-wrap",
            value: "wrap"
        }, {
            key: "width",
            value: "100%"
        }, {
            key: "align-items",
            value: "center"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // ROW
        // =================================================
        object: ".sort-list-row",
        info: [{
            key: "display",
            value: "flex"
        }, {
            key: "flex-wrap",
            value: "wrap"
        }, {
            key: "width",
            value: "100%"
        }, {
            key: "align-items",
            value: "center"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // LIST
        // =================================================
        object: ".sort-list-container",
        info: [{
            key: "display",
            value: "flex"
        }, {
            key: "flex-direction",
            value: "column"
        }, {
            key: "width",
            value: "100%"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // DRAG COLUMN
        // =================================================
        object: ".sort-list-drag",
        info: [{
            key: "flex",
            value: "0 0 30px"
        }, {
            key: "width",
            value: "30px"
        }, {
            key: "min-width",
            value: "30px"
        }, {
            key: "max-width",
            value: "30px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }, {
            key: "display",
            value: "flex"
        }, {
            key: "align-items",
            value: "center"
        }, {
            key: "justify-content",
            value: "center"
        }, {
            key: "cursor",
            value: "grab"
        }, {
            key: "user-select",
            value: "none"
        }, {
            key: "touch-action",
            value: "none"
        }]
    }, {
        // =================================================
        // NAME COLUMN
        // =================================================
        object: ".sort-list-name",
        info: [{
            key: "flex",
            value: "1 1 0"
        }, {
            key: "min-width",
            value: "0"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        object: ".sort-list-name-input",
        info: [{
            key: "display",
            value: "block"
        }, {
            key: "width",
            value: "100%"
        }, {
            key: "min-width",
            value: "0"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // TEXT FIELD
        // =================================================
        object: ".sort-list-field-text",
        info: [{
            key: "flex",
            value: "0 0 200px"
        }, {
            key: "width",
            value: "200px"
        }, {
            key: "min-width",
            value: "200px"
        }, {
            key: "max-width",
            value: "200px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // INTEGER FIELD
        // =================================================
        object: ".sort-list-field-integer",
        info: [{
            key: "flex",
            value: "0 0 60px"
        }, {
            key: "width",
            value: "60px"
        }, {
            key: "min-width",
            value: "60px"
        }, {
            key: "max-width",
            value: "60px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // CHECKMARK FIELD
        // =================================================
        object: ".sort-list-field-checkmark",
        info: [{
            key: "flex",
            value: "0 0 60px"
        }, {
            key: "width",
            value: "60px"
        }, {
            key: "min-width",
            value: "60px"
        }, {
            key: "max-width",
            value: "60px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }, {
            key: "display",
            value: "flex"
        }, {
            key: "align-items",
            value: "center"
        }, {
            key: "justify-content",
            value: "center"
        }]
    }, {
        // =================================================
        // FIELD INPUT
        // =================================================
        object: ".sort-list-field-input",
        info: [{
            key: "display",
            value: "block"
        }, {
            key: "width",
            value: "100%"
        }, {
            key: "min-width",
            value: "0"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // CHECKBOX
        // =================================================
        object: ".sort-list-field-checkbox",
        info: [{
            key: "width",
            value: "18px"
        }, {
            key: "height",
            value: "18px"
        }, {
            key: "margin",
            value: "0"
        }]
    }, {
        // =================================================
        // DELETE COLUMN
        // =================================================
        object: ".sort-list-delete",
        info: [{
            key: "flex",
            value: "0 0 40px"
        }, {
            key: "width",
            value: "40px"
        }, {
            key: "min-width",
            value: "40px"
        }, {
            key: "max-width",
            value: "40px"
        }, {
            key: "box-sizing",
            value: "border-box"
        }, {
            key: "display",
            value: "flex"
        }, {
            key: "align-items",
            value: "center"
        }, {
            key: "justify-content",
            value: "center"
        }]
    }, {
        object: ".sort-list-remove",
        info: [{
            key: "width",
            value: "28px"
        }, {
            key: "height",
            value: "28px"
        }, {
            key: "padding",
            value: "0"
        }, {
            key: "box-sizing",
            value: "border-box"
        }]
    }, {
        // =================================================
        // SORTABLE GHOST
        // =================================================
        object: ".sort-list-ghost",
        info: [{
            key: "opacity",
            value: "0.35"
        }]
    }],

    component: class {

        constructor(dataArray, entryElement, elementSetting) {

            // =================================================
            // ELEMENTS
            // =================================================

            // entryElement = [previewElement, popupElement]

            this.previewElement = entryElement[0];
            this.popupElement = entryElement[1];

            this.elementSetting = elementSetting;


            // =================================================
            // ORIGINAL DATA
            // =================================================

            /*
             * IMPORTANT:
             *
             * dataArray may be a Proxy.
             *
             * We DO NOT modify it while editing.
             *
             * It is only modified inside onSave().
             */

            this.originalDataArray = dataArray;

            this.dataArray = Array.isArray(dataArray)
                ? dataArray
                : (
                    Array.isArray(elementSetting.default)
                        ? elementSetting.default
                        : []
                );


            // =================================================
            // EXTRA FIELDS
            // =================================================

            this.extraFields =
                Array.isArray(elementSetting.extraFields)
                    ? elementSetting.extraFields
                    : [];


            // =================================================
            // WORKING COPY
            // =================================================

            /*
             * Everything inside the popup works with this
             * array instead of the original Proxy.
             */

            this.workingArray = this.dataArray.map(item => {
                return this.normalizeItem(item);
            });


            // =================================================
            // SORTABLE
            // =================================================

            this.sortable = null;


            // =================================================
            // PREVIEW
            // =================================================

            this.previewText =
                document.createElement("p");

            this.previewElement.innerHTML = "";

            this.previewElement.appendChild(
                this.previewText
            );

            this.updatePreview();


            // =================================================
            // POPUP
            // =================================================

            this.popupElement.innerHTML = "";


            // =================================================
            // ROOT
            // =================================================

            this.root =
                document.createElement("div");

            this.root.className =
                "sort-list-root";

            this.popupElement.appendChild(
                this.root
            );


            // =================================================
            // ADD AREA
            // =================================================

            const addArea =
                document.createElement("div");

            addArea.className =
                "sort-list-add";


            this.addInput =
                document.createElement("input");

            this.addInput.type = "text";

            this.addInput.placeholder =
                "Add list element...";

            this.addInput.className =
                "sort-list-input";


            const addButton =
                document.createElement("button");

            addButton.type = "button";

            addButton.textContent = "Add";

            addButton.className =
                "sort-list-add-button";


            addArea.appendChild(
                this.addInput
            );

            addArea.appendChild(
                addButton
            );


            this.root.appendChild(
                addArea
            );


            // =================================================
            // LIST CONTAINER
            // =================================================

            this.list =
                document.createElement("div");

            this.list.className =
                "sort-list-container";

            this.root.appendChild(
                this.list
            );


            // =================================================
            // INITIAL RENDER
            // =================================================

            this.renderList();


            // =================================================
            // ADD ITEM
            // =================================================

            const addItem = () => {

                const name =
                    this.addInput.value.trim();

                if (!name) {
                    return;
                }


                const item = {
                    name: name
                };


                // Add defaults for every custom field

                this.extraFields.forEach(field => {

                    item[field.label] =
                        this.getDefaultValue(field);

                });


                // Add to working copy

                this.workingArray.push(item);


                // Clear input

                this.addInput.value = "";


                // Re-render

                this.renderList();


                // Focus input again

                this.addInput.focus();
            };


            addButton.addEventListener(
                "click",
                addItem
            );


            this.addInput.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        addItem();
                    }
                }
            );
        }


        // =================================================
        // NORMALIZE ITEM
        // =================================================

        normalizeItem(item) {

            /*
             * Existing object
             */

            if (
                item &&
                typeof item === "object" &&
                !Array.isArray(item)
            ) {

                const normalized = {
                    ...item
                };


                if (normalized.name === undefined) {
                    normalized.name = "";
                }


                /*
                 * Make sure every extra field exists.
                 */

                this.extraFields.forEach(field => {

                    if (!(field.label in normalized)) {

                        normalized[field.label] =
                            this.getDefaultValue(field);
                    }
                });


                return normalized;
            }


            /*
             * Existing primitive value.
             *
             * Example:
             *
             * ["Apple", "Orange"]
             */

            const normalized = {

                name:
                    item == null
                        ? ""
                        : String(item)

            };


            this.extraFields.forEach(field => {

                normalized[field.label] =
                    this.getDefaultValue(field);

            });


            return normalized;
        }


        // =================================================
        // DEFAULT VALUE
        // =================================================

        getDefaultValue(field) {

            if (field.default !== undefined) {

                return field.default;
            }


            switch (field.type) {

                case "integer":
                    return 0;


                case "checkmark":
                    return false;


                case "text":
                default:
                    return "";
            }
        }


        // =================================================
        // GET FIELD CLASS
        // =================================================

        getFieldClass(field) {

            switch (field.type) {

                case "text":
                    return "sort-list-field-text";


                case "integer":
                    return "sort-list-field-integer";


                case "checkmark":
                    return "sort-list-field-checkmark";


                default:
                    return "sort-list-field-text";
            }
        }


        // =================================================
        // CREATE FIELD INPUT
        // =================================================

        createFieldInput(item, field) {

            let input;


            switch (field.type) {

                // -----------------------------------------
                // INTEGER
                // -----------------------------------------

                case "integer": {

                    input =
                        document.createElement("input");

                    input.type = "number";

                    input.step = "1";

                    input.value =
                        item[field.label] ?? "";


                    input.addEventListener(
                        "input",
                        () => {

                            if (input.value === "") {

                                item[field.label] =
                                    field.optional
                                        ? ""
                                        : this.getDefaultValue(field);

                            } else {

                                item[field.label] =
                                    parseInt(
                                        input.value,
                                        10
                                    );
                            }
                        }
                    );


                    break;
                }


                // -----------------------------------------
                // CHECKMARK
                // -----------------------------------------

                case "checkmark": {

                    input =
                        document.createElement("input");

                    input.type = "checkbox";

                    input.checked =
                        Boolean(item[field.label]);


                    input.addEventListener(
                        "change",
                        () => {

                            item[field.label] =
                                input.checked;
                        }
                    );


                    break;
                }


                // -----------------------------------------
                // TEXT
                // -----------------------------------------

                case "text":

                default: {

                    input =
                        document.createElement("input");

                    input.type = "text";

                    input.value =
                        item[field.label] ?? "";


                    input.addEventListener(
                        "input",
                        () => {

                            item[field.label] =
                                input.value;
                        }
                    );


                    break;
                }
            }


            input.className =
                "sort-list-field-input";


            if (field.optional === false) {

                input.required = true;
            }


            return input;
        }


        // =================================================
        // CREATE HEADER CELL
        // =================================================

        createHeaderCell(
            parent,
            text,
            className
        ) {

            const cell =
                document.createElement("div");

            /*
             * IMPORTANT:
             *
             * Header and row use exactly the
             * same class for each column.
             */

            cell.className = className;

            cell.textContent = text;

            parent.appendChild(cell);

            return cell;
        }


        // =================================================
        // RENDER LIST
        // =================================================

        renderList() {

            // ---------------------------------------------
            // DESTROY OLD SORTABLE
            // ---------------------------------------------

            if (this.sortable) {

                this.sortable.destroy();

                this.sortable = null;
            }


            // ---------------------------------------------
            // CLEAR LIST
            // ---------------------------------------------

            this.list.innerHTML = "";


            // =================================================
            // HEADER
            // =================================================

            const header =
                document.createElement("div");

            header.className =
                "sort-list-header";


            /*
             * Drag column
             *
             * 30px
             */

            this.createHeaderCell(
                header,
                "",
                "sort-list-drag"
            );


            /*
             * Name column
             *
             * flex: 1
             */

            this.createHeaderCell(
                header,
                "Name",
                "sort-list-name"
            );


            /*
             * Extra fields
             *
             * Same order as elementSetting.extraFields
             */

            this.extraFields.forEach(field => {

                let label = field.label;


                if (field.optional) {

                    label += " (optional)";
                }


                this.createHeaderCell(
                    header,
                    label,
                    this.getFieldClass(field)
                );
            });


            /*
             * Delete column
             *
             * 40px
             */

            this.createHeaderCell(
                header,
                "Delete",
                "sort-list-delete"
            );


            this.list.appendChild(
                header
            );


            // =================================================
            // ROW CONTAINER
            // =================================================

            const rows =
                document.createElement("div");

            rows.className =
                "sort-list-container";


            /*
             * The actual sortable rows live here.
             *
             * This is NOT a table.
             */

            this.list.appendChild(
                rows
            );


            // =================================================
            // ROWS
            // =================================================

            this.workingArray.forEach(
                (item, index) => {

                    const row =
                        document.createElement("div");

                    row.className =
                        "sort-list-row";


                    // -----------------------------------------
                    // DRAG
                    // -----------------------------------------

                    const drag =
                        document.createElement("div");

                    drag.className =
                        "sort-list-drag";


                    const handle =
                        document.createElement("span");

                    handle.className =
                        "sort-list-handle";

                    handle.textContent =
                        "☷";


                    drag.appendChild(
                        handle
                    );

                    row.appendChild(
                        drag
                    );


                    // -----------------------------------------
                    // NAME
                    // -----------------------------------------

                    const name =
                        document.createElement("div");

                    name.className =
                        "sort-list-name";


                    const nameInput =
                        document.createElement("input");

                    nameInput.type =
                        "text";

                    nameInput.className =
                        "sort-list-name-input";

                    nameInput.value =
                        item.name ?? "";


                    nameInput.addEventListener(
                        "input",
                        () => {

                            item.name =
                                nameInput.value;

                            this.updatePreview();
                        }
                    );


                    name.appendChild(
                        nameInput
                    );

                    row.appendChild(
                        name
                    );


                    // -----------------------------------------
                    // EXTRA FIELDS
                    // -----------------------------------------

                    this.extraFields.forEach(
                        field => {

                            const cell =
                                document.createElement("div");

                            /*
                             * IMPORTANT:
                             *
                             * Header and row use the
                             * exact same field class.
                             *
                             * Therefore:
                             *
                             * text      = 200px
                             * integer   = 60px
                             * checkmark = 60px
                             */

                            cell.className =
                                this.getFieldClass(field);


                            const input =
                                this.createFieldInput(
                                    item,
                                    field
                                );


                            cell.appendChild(
                                input
                            );


                            row.appendChild(
                                cell
                            );
                        }
                    );


                    // -----------------------------------------
                    // DELETE
                    // -----------------------------------------

                    const deleteCell =
                        document.createElement("div");

                    deleteCell.className =
                        "sort-list-delete";


                    const deleteButton =
                        document.createElement("button");

                    deleteButton.type =
                        "button";

                    deleteButton.className =
                        "sort-list-remove";

                    deleteButton.textContent =
                        "×";


                    deleteButton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            /*
                             * Remove from working copy only.
                             */

                            this.workingArray.splice(
                                index,
                                1
                            );


                            /*
                             * Re-render so indexes remain
                             * correct.
                             */

                            this.renderList();


                            this.updatePreview();
                        }
                    );


                    deleteCell.appendChild(
                        deleteButton
                    );

                    row.appendChild(
                        deleteCell
                    );


                    // -----------------------------------------
                    // ADD ROW
                    // -----------------------------------------

                    rows.appendChild(
                        row
                    );
                }
            );


            // =================================================
            // SORTABLE
            // =================================================

            if (
                typeof Sortable !== "undefined"
            ) {

                this.sortable =
                    new Sortable(
                        rows,
                        {

                            animation: 150,

                            /*
                             * Only the drag handle starts
                             * a sort.
                             */

                            handle:
                                ".sort-list-handle",


                            /*
                             * Inputs and buttons should
                             * remain interactive.
                             */

                            filter:
                                "input, button",


                            ghostClass:
                                "sort-list-ghost",


                            onEnd: event => {

                                const oldIndex =
                                    event.oldIndex;

                                const newIndex =
                                    event.newIndex;


                                if (
                                    oldIndex === undefined ||
                                    newIndex === undefined ||
                                    oldIndex === newIndex
                                ) {

                                    return;
                                }


                                /*
                                 * Move item inside
                                 * working copy.
                                 */

                                const movedItem =
                                    this.workingArray.splice(
                                        oldIndex,
                                        1
                                    )[0];


                                this.workingArray.splice(
                                    newIndex,
                                    0,
                                    movedItem
                                );


                                this.updatePreview();
                            }
                        }
                    );
            }


            // =================================================
            // PREVIEW
            // =================================================

            this.updatePreview();
        }


        // =================================================
        // UPDATE PREVIEW
        // =================================================

        updatePreview() {

            this.previewText.textContent =
                this.workingArray
                    .map(item => item.name)
                    .join(", ");
        }


        // =================================================
        // POPUP CLOSE
        // =================================================

        onPopupClose() {

            /*
             * IMPORTANT:
             *
             * Do NOT commit workingArray here.
             *
             * The original Proxy remains untouched.
             */

            this.updatePreview();
        }


        // =================================================
        // SAVE
        // =================================================

        onSave() {

            // ---------------------------------------------
            // DESTROY SORTABLE
            // ---------------------------------------------

            if (this.sortable) {

                this.sortable.destroy();

                this.sortable = null;
            }


            // ---------------------------------------------
            // COMMIT TO ORIGINAL ARRAY / PROXY
            // ---------------------------------------------

            if (
                Array.isArray(
                    this.originalDataArray
                )
            ) {

                /*
                 * This is the ONLY place where the
                 * original Proxy is changed.
                 *
                 * splice() preserves the original
                 * array / Proxy reference.
                 */

                this.originalDataArray.splice(
                    0,
                    this.originalDataArray.length,
                    ...this.workingArray
                );


                return this.originalDataArray;
            }


            // ---------------------------------------------
            // FALLBACK
            // ---------------------------------------------

            return this.workingArray;
        }
    },


    // =================================================
    // CANVAS PREVIEW
    // =================================================

    render: function(dataArray) {

        if (!Array.isArray(dataArray)) {

            return "";
        }


        return dataArray
            .map(item => {

                if (
                    item &&
                    typeof item === "object" &&
                    !Array.isArray(item)
                ) {

                    return item.name ?? "";
                }


                return String(item);
            })
            .join(", ");
    }
};
```
