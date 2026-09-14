const Advance = {
    strutureSample: [],

    displayType: "popupMedium",

    cssStyles: {
        ".advance-root": {
            "width": "100%",
            "max-width": "100%",
            "box-sizing": "border-box"
        },

        ".advance-add": {
            "display": "flex",
            "width": "100%",
            "box-sizing": "border-box",
            "gap": "8px",
            "margin-bottom": "12px"
        },

        ".advance-add-input": {
            "flex": "1 1 auto",
            "width": "100%",
            "min-width": "0",
            "box-sizing": "border-box"
        },

        ".advance-add-button": {
            "flex": "0 0 auto",
            "box-sizing": "border-box"
        },

        /* -----------------------------------------
           TREE LIST
        ----------------------------------------- */

        ".advance-list": {
            "display": "flex",
            "flex-direction": "column",
            "width": "100%",
            "max-width": "100%",
            "box-sizing": "border-box",
            "gap": "6px",
            "min-height": "10px"
        },

        /* -----------------------------------------
           ITEM
        ----------------------------------------- */

        ".advance-item": {
            "display": "block",
            "width": "100%",
            "max-width": "100%",
            "box-sizing": "border-box"
        },

        ".advance-item-row": {
            "display": "flex",
            "align-items": "center",
            "width": "100%",
            "min-width": "0",
            "min-height": "36px",
            "box-sizing": "border-box",
            "gap": "6px",
            "padding": "4px 6px"
        },

        /* -----------------------------------------
           DRAG HANDLE
        ----------------------------------------- */

        ".advance-handle": {
            "display": "flex",
            "flex": "0 0 24px",
            "align-items": "center",
            "justify-content": "center",
            "width": "24px",
            "height": "28px",
            "cursor": "grab",
            "user-select": "none",
            "touch-action": "none"
        },

        ".advance-handle:active": {
            "cursor": "grabbing"
        },

        /* -----------------------------------------
           EDIT INPUT
        ----------------------------------------- */

        ".advance-item-input": {
            "display": "block",
            "flex": "1 1 auto",
            "width": "100%",
            "min-width": "0",
            "height": "30px",
            "box-sizing": "border-box",
            "padding": "3px 6px",
            "border": "1px solid transparent",
            "outline": "none"
        },

        /* -----------------------------------------
           REMOVE
        ----------------------------------------- */

        ".advance-remove": {
            "display": "flex",
            "flex": "0 0 28px",
            "align-items": "center",
            "justify-content": "center",
            "width": "28px",
            "height": "28px",
            "padding": "0",
            "border": "0",
            "background": "transparent",
            "cursor": "pointer"
        },

        /* -----------------------------------------
           CHILDREN AREA
        ----------------------------------------- */

        ".advance-children": {
            "display": "block",
            "width": "calc(100% - 28px)",
            "max-width": "calc(100% - 28px)",
            "margin-left": "28px",
            "padding-left": "10px",
            "box-sizing": "border-box"
        },

        /* -----------------------------------------
           NESTING DROP SPACE
        ----------------------------------------- */

        ".advance-nest-space": {
            "display": "flex",
            "width": "100%",
            "min-height": "34px",
            "margin-top": "3px",
            "margin-bottom": "3px",
            "box-sizing": "border-box",
            "align-items": "center",
            "justify-content": "center",
            "padding": "6px",
            "border": "1px dashed currentColor",
            "font-size": "12px",
            "user-select": "none"
        },

        ".advance-nest-space-text": {
            "display": "block",
            "pointer-events": "none",
            "text-align": "center"
        },

        /* -----------------------------------------
           SORTABLE STATES
        ----------------------------------------- */

        ".advance-ghost": {
            "opacity": "0.35"
        },

        ".advance-chosen": {
            "box-sizing": "border-box"
        },

        ".advance-drag": {
            "box-sizing": "border-box"
        },

        ".advance-drop-invalid": {
            "opacity": "0.4"
        }
    },

    component: class {
        constructor(
            dataArray,
            entryElement,
            elementSetting
        ) {
            // =================================================
            // ELEMENTS
            // =================================================

            this.previewElement =
                entryElement[0];

            this.popupElement =
                entryElement[1];

            this.elementSetting =
                elementSetting;

            // =================================================
            // ORIGINAL PROXY
            // =================================================

            this.originalDataArray =
                dataArray;

            // =================================================
            // NEST LIMIT
            // =================================================

            this.nestLimit = Math.max(
                1,
                Number(
                    elementSetting.nestLimit
                ) || 1
            );

            // =================================================
            // WORKING TREE
            // =================================================

            this.workingArray =
                this.cloneTree(
                    Array.isArray(dataArray)
                        ? dataArray
                        : (
                            Array.isArray(
                                elementSetting.default
                            )
                                ? elementSetting.default
                                : []
                        )
                );

            // =================================================
            // SORTABLE INSTANCES
            // =================================================

            this.sortables = [];

            // =================================================
            // PREVIEW
            // =================================================

            this.previewElement.innerHTML =
                "";

            this.previewElement.classList.add(
                "advance-preview"
            );

            this.previewTreeElement =
                document.createElement(
                    "div"
                );

            this.previewTreeElement.className =
                "advance-preview-tree";

            this.previewElement.appendChild(
                this.previewTreeElement
            );

            this.updatePreview();

            // =================================================
            // POPUP
            // =================================================

            this.popupElement.innerHTML =
                "";

            this.rootElement =
                document.createElement(
                    "div"
                );

            this.rootElement.className =
                "advance-root";

            this.popupElement.appendChild(
                this.rootElement
            );

            // =================================================
            // ADD AREA
            // =================================================

            const addArea =
                document.createElement(
                    "div"
                );

            addArea.className =
                "advance-add";

            this.addInput =
                document.createElement(
                    "input"
                );

            this.addInput.type = "text";
            this.addInput.className =
                "advance-add-input";

            this.addInput.placeholder =
                "Add list element...";

            const addButton =
                document.createElement(
                    "button"
                );

            addButton.type = "button";
            addButton.className =
                "advance-add-button";

            addButton.textContent =
                "Add";

            addArea.appendChild(
                this.addInput
            );

            addArea.appendChild(
                addButton
            );

            this.rootElement.appendChild(
                addArea
            );

            // =================================================
            // ROOT LIST
            // =================================================

            this.rootList =
                document.createElement(
                    "div"
                );

            this.rootList.className =
                "advance-list";

            this.rootList.dataset.depth =
                "1";

            this.rootElement.appendChild(
                this.rootList
            );

            // =================================================
            // ADD ROOT ITEM
            // =================================================

            const addRootItem =
                () => {
                    const value =
                        this.addInput.value.trim();

                    if (!value) {
                        return;
                    }

                    this.workingArray.push({
                        name: value,
                        children: []
                    });

                    this.addInput.value =
                        "";

                    this.renderTree();

                    this.addInput.focus();

                    this.updatePreview();
                };

            addButton.addEventListener(
                "click",
                addRootItem
            );

            this.addInput.addEventListener(
                "keydown",
                event => {
                    if (
                        event.key ===
                        "Enter"
                    ) {
                        event.preventDefault();

                        addRootItem();
                    }
                }
            );

            // =================================================
            // INITIAL RENDER
            // =================================================

            this.renderTree();
        }

        // =====================================================
        // RESULT
        // =====================================================

        initResult() {
            return {
                code: 0
            };
        }

        // =====================================================
        // CLONE TREE
        // =====================================================

        cloneTree(array) {
            if (!Array.isArray(array)) {
                return [];
            }

            return array.map(item => {
                if (
                    item &&
                    typeof item ===
                        "object"
                ) {
                    const cloned = {
                        ...item,

                        name:
                            item.name ??
                            item.label ??
                            "",

                        children:
                            this.cloneTree(
                                Array.isArray(
                                    item.children
                                )
                                    ? item.children
                                    : []
                            )
                    };

                    return cloned;
                }

                return {
                    name: String(item),
                    children: []
                };
            });
        }

        // =====================================================
        // ID
        // =====================================================

        createId() {
            return (
                "advance_" +
                Date.now().toString(36) +
                "_" +
                Math.random()
                    .toString(36)
                    .slice(2, 10)
            );
        }

        // =====================================================
        // ENSURE IDS
        // =====================================================

        ensureIds(array) {
            if (!Array.isArray(array)) {
                return;
            }

            array.forEach(item => {
                if (!item.__advanceId) {
                    item.__advanceId =
                        this.createId();
                }

                if (
                    Array.isArray(
                        item.children
                    )
                ) {
                    this.ensureIds(
                        item.children
                    );
                }
            });
        }

        // =====================================================
        // PREVIEW
        // =====================================================

        updatePreview() {
            this.previewTreeElement.innerHTML =
                "";

            this.renderPreviewLevel(
                this.workingArray,
                this.previewTreeElement,
                1
            );
        }

        renderPreviewLevel(
            array,
            container,
            depth
        ) {
            if (!Array.isArray(array)) {
                return;
            }

            array.forEach(item => {
                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "advance-preview-item";

                row.style.paddingLeft =
                    (
                        (depth - 1) * 20
                    ) + "px";

                row.textContent =
                    String(
                        item.name ?? ""
                    );

                container.appendChild(
                    row
                );

                if (
                    Array.isArray(
                        item.children
                    ) &&
                    item.children.length
                ) {
                    this.renderPreviewLevel(
                        item.children,
                        container,
                        depth + 1
                    );
                }
            });
        }

        // =====================================================
        // RENDER TREE
        // =====================================================

        renderTree() {
            this.destroySortables();

            this.rootList.innerHTML =
                "";

            this.ensureIds(
                this.workingArray
            );

            this.renderLevel(
                this.workingArray,
                this.rootList,
                1
            );

            this.updatePreview();
        }

        // =====================================================
        // RENDER LEVEL
        // =====================================================

        renderLevel(
            array,
            listElement,
            depth
        ) {
            listElement.dataset.depth =
                String(depth);

            array.forEach(
                item => {
                    const element =
                        this.createItem(
                            item,
                            array,
                            depth
                        );

                    listElement.appendChild(
                        element
                    );
                }
            );

            this.createSortable(
                listElement,
                depth
            );
        }

        // =====================================================
        // CREATE ITEM
        // =====================================================

        createItem(
            item,
            parentArray,
            depth
        ) {
            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "advance-item";

            wrapper.dataset.advanceId =
                item.__advanceId;

            wrapper.dataset.depth =
                String(depth);

            // =================================================
            // ROW
            // =================================================

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "advance-item-row";

            // =================================================
            // HANDLE
            // =================================================

            const handle =
                document.createElement(
                    "span"
                );

            handle.className =
                "advance-handle";

            handle.textContent =
                "☷";

            // =================================================
            // INPUT
            // =================================================

            const input =
                document.createElement(
                    "input"
                );

            input.type = "text";

            input.className =
                "advance-item-input";

            input.value =
                item.name ?? "";

            input.addEventListener(
                "input",
                () => {
                    item.name =
                        input.value;

                    this.updatePreview();
                }
            );

            // =================================================
            // REMOVE
            // =================================================

            const remove =
                document.createElement(
                    "button"
                );

            remove.type = "button";

            remove.className =
                "advance-remove";

            remove.textContent =
                "×";

            remove.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    const index =
                        parentArray.indexOf(
                            item
                        );

                    if (index !== -1) {
                        parentArray.splice(
                            index,
                            1
                        );
                    }

                    this.renderTree();
                }
            );

            row.appendChild(
                handle
            );

            row.appendChild(
                input
            );

            row.appendChild(
                remove
            );

            wrapper.appendChild(
                row
            );

            // =================================================
            // CHILDREN
            // =================================================

            if (
                depth <
                this.nestLimit
            ) {
                if (
                    !Array.isArray(
                        item.children
                    )
                ) {
                    item.children = [];
                }

                const childrenArea =
                    document.createElement(
                        "div"
                    );

                childrenArea.className =
                    "advance-children";

                // ---------------------------------------------
                // CHILD LIST
                // ---------------------------------------------

                const childList =
                    document.createElement(
                        "div"
                    );

                childList.className =
                    "advance-list";

                childList.dataset.depth =
                    String(
                        depth + 1
                    );

                // ---------------------------------------------
                // EXISTING CHILDREN
                // ---------------------------------------------

                this.renderLevel(
                    item.children,
                    childList,
                    depth + 1
                );

                childrenArea.appendChild(
                    childList
                );

                // ---------------------------------------------
                // DEDICATED NEST SPACE
                // ---------------------------------------------

                const nestSpace =
                    document.createElement(
                        "div"
                    );

                nestSpace.className =
                    "advance-nest-space";

                nestSpace.dataset.ownerId =
                    item.__advanceId;

                const nestText =
                    document.createElement(
                        "span"
                    );

                nestText.className =
                    "advance-nest-space-text";

                nestText.textContent =
                    "drag element here for nesting";

                nestSpace.appendChild(
                    nestText
                );

                childrenArea.appendChild(
                    nestSpace
                );

                wrapper.appendChild(
                    childrenArea
                );
            }

            return wrapper;
        }

        // =====================================================
        // SORTABLE
        // =====================================================

        createSortable(
            listElement,
            depth
        ) {
            if (
                typeof Sortable ===
                "undefined"
            ) {
                return;
            }

            const sortable =
                new Sortable(
                    listElement,
                    {
                        animation: 180,

                        direction:
                            "vertical",

                        draggable:
                            ".advance-item",

                        handle:
                            ".advance-handle",

                        ghostClass:
                            "advance-ghost",

                        chosenClass:
                            "advance-chosen",

                        dragClass:
                            "advance-drag",

                        fallbackOnBody:
                            true,

                        swapThreshold:
                            0.65,

                        emptyInsertThreshold:
                            20,

                        group: {
                            name:
                                "advance-tree",

                            pull: true,

                            put: true
                        },

                        // =================================================
                        // START
                        // =================================================

                        onStart: event => {
                            this.draggedElement =
                                event.item;

                            this.showDropSpaces(
                                event.item
                            );
                        },

                        // =================================================
                        // MOVE
                        // =================================================

                        onMove: event => {
                            return this.handleMove(
                                event
                            );
                        },

                        // =================================================
                        // END
                        // =================================================

                        onEnd: event => {
                            this.hideDropSpaces();

                            this.draggedElement =
                                null;

                            /*
                             * Sortable has finished
                             * modifying the DOM.
                             *
                             * Now convert the DOM
                             * hierarchy back into
                             * workingArray.
                             */
                            this.rebuildTreeFromDOM();

                            this.updatePreview();
                        }
                    }
                );

            this.sortables.push(
                sortable
            );
        }

        // =====================================================
        // ON MOVE
        // =====================================================

        handleMove(event) {
            const dragged =
                event.dragged;

            const destination =
                event.to;

            if (
                !dragged ||
                !destination
            ) {
                return false;
            }

            // -------------------------------------------------
            // 1. Never drop into itself.
            // -------------------------------------------------

            if (
                dragged ===
                destination
            ) {
                return false;
            }

            // -------------------------------------------------
            // 2. Never drop into own descendants.
            // -------------------------------------------------

            if (
                dragged.contains(
                    destination
                )
            ) {
                return false;
            }

            // -------------------------------------------------
            // 3. Destination depth.
            // -------------------------------------------------

            const destinationDepth =
                this.getListDepth(
                    destination
                );

            // -------------------------------------------------
            // 4. Entire dragged subtree depth.
            // -------------------------------------------------

            const subtreeDepth =
                this.getDOMSubtreeDepth(
                    dragged
                );

            // -------------------------------------------------
            // 5. Calculate deepest resulting level.
            // -------------------------------------------------

            const deepestLevel =
                destinationDepth +
                subtreeDepth -
                1;

            // -------------------------------------------------
            // 6. HARD NEST LIMIT.
            // -------------------------------------------------

            if (
                deepestLevel >
                this.nestLimit
            ) {
                return false;
            }

            // -------------------------------------------------
            // 7. Additional protection:
            // destination cannot be a child list
            // belonging to dragged item.
            // -------------------------------------------------

            const owner =
                destination.closest(
                    ".advance-item"
                );

            if (
                owner &&
                owner === dragged
            ) {
                return false;
            }

            // -------------------------------------------------
            // 8. Valid.
            // -------------------------------------------------

            return true;
        }

        // =====================================================
        // LIST DEPTH
        // =====================================================

        getListDepth(list) {
            const depth =
                Number(
                    list.dataset.depth
                );

            if (
                Number.isFinite(
                    depth
                )
            ) {
                return depth;
            }

            return 1;
        }

        // =====================================================
        // SUBTREE DEPTH
        // =====================================================

        getDOMSubtreeDepth(
            element
        ) {
            const rootDepth =
                Number(
                    element.dataset.depth
                ) || 1;

            let maximum =
                rootDepth;

            const descendants =
                element.querySelectorAll(
                    ".advance-item"
                );

            descendants.forEach(
                child => {
                    const childDepth =
                        Number(
                            child.dataset.depth
                        );

                    if (
                        Number.isFinite(
                            childDepth
                        )
                    ) {
                        maximum =
                            Math.max(
                                maximum,
                                childDepth
                            );
                    }
                }
            );

            return (
                maximum -
                rootDepth +
                1
            );
        }

        // =====================================================
        // DROP SPACE DISPLAY
        // =====================================================

        showDropSpaces(
            dragged
        ) {
            const spaces =
                this.popupElement.querySelectorAll(
                    ".advance-nest-space"
                );

            const subtreeDepth =
                this.getDOMSubtreeDepth(
                    dragged
                );

            spaces.forEach(
                space => {
                    const ownerId =
                        space.dataset
                            .ownerId;

                    // -----------------------------------------
                    // Do not show a drop target inside itself.
                    // -----------------------------------------

                    if (
                        ownerId ===
                        dragged.dataset
                            .advanceId
                    ) {
                        space.style.display =
                            "none";

                        return;
                    }

                    const list =
                        space.previousElementSibling;

                    if (!list) {
                        return;
                    }

                    const depth =
                        this.getListDepth(
                            list
                        );

                    const resultingDepth =
                        depth +
                        subtreeDepth -
                        1;

                    if (
                        resultingDepth <=
                        this.nestLimit
                    ) {
                        space.style.display =
                            "flex";
                    } else {
                        space.style.display =
                            "none";
                    }
                }
            );
        }

        hideDropSpaces() {
            const spaces =
                this.popupElement.querySelectorAll(
                    ".advance-nest-space"
                );

            spaces.forEach(
                space => {
                    space.style.display =
                        "flex";
                }
            );
        }

        // =====================================================
        // REBUILD TREE FROM DOM
        // =====================================================

        rebuildTreeFromDOM() {
            const oldTree =
                this.workingArray;

            const readList =
                listElement => {
                    const result = [];

                    Array.from(
                        listElement.children
                    ).forEach(
                        element => {
                            if (
                                !element.classList.contains(
                                    "advance-item"
                                )
                            ) {
                                return;
                            }

                            const id =
                                element.dataset
                                    .advanceId;

                            const oldItem =
                                this.findById(
                                    oldTree,
                                    id
                                );

                            const input =
                                element.querySelector(
                                    ":scope > .advance-item-row > .advance-item-input"
                                );

                            const item =
                                oldItem
                                    ? {
                                        ...oldItem
                                    }
                                    : {
                                        name: "",
                                        children: []
                                    };

                            item.__advanceId =
                                id;

                            item.name =
                                input
                                    ? input.value
                                    : "";

                            const childList =
                                element.querySelector(
                                    ":scope > .advance-children > .advance-list"
                                );

                            if (
                                childList
                            ) {
                                item.children =
                                    readList(
                                        childList
                                    );
                            } else {
                                item.children =
                                    [];
                            }

                            result.push(
                                item
                            );
                        }
                    );

                    return result;
                };

            this.workingArray =
                readList(
                    this.rootList
                );
        }

        // =====================================================
        // FIND ITEM
        // =====================================================

        findById(
            array,
            id
        ) {
            if (
                !Array.isArray(
                    array
                )
            ) {
                return null;
            }

            for (
                const item of array
            ) {
                if (
                    item &&
                    item.__advanceId ===
                        id
                ) {
                    return item;
                }

                if (
                    item &&
                    Array.isArray(
                        item.children
                    )
                ) {
                    const found =
                        this.findById(
                            item.children,
                            id
                        );

                    if (found) {
                        return found;
                    }
                }
            }

            return null;
        }

        // =====================================================
        // DESTROY SORTABLE
        // =====================================================

        destroySortables() {
            if (
                !Array.isArray(
                    this.sortables
                )
            ) {
                this.sortables = [];

                return;
            }

            this.sortables.forEach(
                sortable => {
                    if (
                        sortable &&
                        typeof sortable.destroy ===
                            "function"
                    ) {
                        sortable.destroy();
                    }
                }
            );

            this.sortables = [];
        }

        // =====================================================
        // REMOVE INTERNAL IDS
        // =====================================================

        cleanTree(array) {
            if (!Array.isArray(array)) {
                return [];
            }

            return array.map(
                item => {
                    const result = {};

                    Object.keys(
                        item
                    ).forEach(
                        key => {
                            if (
                                key !==
                                "__advanceId"
                            ) {
                                result[key] =
                                    item[key];
                            }
                        }
                    );

                    result.children =
                        this.cleanTree(
                            Array.isArray(
                                item.children
                            )
                                ? item.children
                                : []
                        );

                    return result;
                }
            );
        }

        // =====================================================
        // POPUP CLOSE
        // =====================================================

        onPopupClose() {
            this.hideDropSpaces();

            this.updatePreview();
        }

        // =====================================================
        // SAVE
        // =====================================================

        onSave() {
            // -----------------------------------------------
            // Destroy EVERY Sortable instance.
            // -----------------------------------------------

            this.destroySortables();

            this.draggedElement =
                null;

            // -----------------------------------------------
            // Clean internal IDs.
            // -----------------------------------------------

            const cleanData =
                this.cleanTree(
                    this.workingArray
                );

            // -----------------------------------------------
            // IMPORTANT:
            // Mutate the EXISTING Proxy.
            // -----------------------------------------------

            if (
                Array.isArray(
                    this.originalDataArray
                )
            ) {
                this.originalDataArray.splice(
                    0,
                    this.originalDataArray.length,
                    ...cleanData
                );

                return this.originalDataArray;
            }

            return cleanData;
        }
    },

    // =========================================================
    // RENDER
    // =========================================================

    render: function(
        dataArray
    ) {
        if (
            !Array.isArray(
                dataArray
            )
        ) {
            return "";
        }

        const result = [];

        const flatten =
            array => {
                array.forEach(
                    item => {
                        if (!item) {
                            return;
                        }

                        result.push(
                            String(
                                item.name ??
                                item.label ??
                                ""
                            )
                        );

                        if (
                            Array.isArray(
                                item.children
                            )
                        ) {
                            flatten(
                                item.children
                            );
                        }
                    }
                );
            };

        flatten(dataArray);

        return result.join(
            ", "
        );
    }
}
