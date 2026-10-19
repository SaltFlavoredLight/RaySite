
function initRayHooks(root = document) {
    function getPanel(name) {
        return root.querySelector(
            `[data-hook-react="${CSS.escape(name)}"]`
        );
    }

    function closePanel(name) {
        const panel = getPanel(name);
        if (!panel) return;

        panel.classList.remove("opened");
        panel.classList.add("closed");

        const status = panel.querySelector(".status");
        if (status) status.textContent = "CLOSED";

        root.querySelectorAll("button").forEach(button => {
            const buttonName =
                button.getAttribute("data-hook-triggler") ||
                button.getAttribute("data-hook-open") ||
                button.getAttribute("data-hook-close");

            if (buttonName === name) {
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setPanel(name, shouldOpen) {
        const panel = getPanel(name);
        if (!panel) return;

        const separator = name.indexOf("-");
        const group = separator > 0
            ? name.slice(0, separator)
            : null;

        // Opening one panel closes others in its group.
        if (shouldOpen && group) {
            root.querySelectorAll("[data-hook-react]").forEach(other => {
                const otherName =
                    other.getAttribute("data-hook-react");

                const otherSeparator = otherName.indexOf("-");
                const otherGroup = otherSeparator > 0
                    ? otherName.slice(0, otherSeparator)
                    : null;

                if (otherGroup === group && otherName !== name) {
                    closePanel(otherName);
                }
            });
        }

        panel.classList.toggle("opened", shouldOpen);
        panel.classList.toggle("closed", !shouldOpen);

        const status = panel.querySelector(".status");
        if (status) {
            status.textContent = shouldOpen ? "OPENED" : "CLOSED";
        }

        root.querySelectorAll("button").forEach(button => {
            const buttonName =
                button.getAttribute("data-hook-triggler") ||
                button.getAttribute("data-hook-open") ||
                button.getAttribute("data-hook-close");

            if (buttonName === name) {
                button.setAttribute(
                    "aria-expanded",
                    String(shouldOpen)
                );
            }
        });
    }

    function handleClick(event) {
        const button = event.target.closest("button");
        if (!button || !root.contains(button)) return;

        const closeName = button.getAttribute("data-hook-close");
        const openName = button.getAttribute("data-hook-open");
        const toggleName = button.getAttribute("data-hook-triggler");

        if (closeName) {
            setPanel(closeName, false);
        } else if (openName) {
            setPanel(openName, true);
        } else if (toggleName) {
            const panel = getPanel(toggleName);
            if (!panel) return;

            setPanel(
                toggleName,
                !panel.classList.contains("opened")
            );
        }
    }

    root.addEventListener("click", handleClick);

    // Return controls for programmatic use and cleanup.
    return {
        open: name => setPanel(name, true),
        close: name => setPanel(name, false),
        toggle: name => {
            const panel = getPanel(name);
            if (panel) {
                setPanel(name, !panel.classList.contains("opened"));
            }
        },
        destroy: () => root.removeEventListener("click", handleClick)
    };
}

const rayHooks = initRayHooks();
