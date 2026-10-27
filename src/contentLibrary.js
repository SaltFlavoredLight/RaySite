'use strict';

import { flexEngineDefaultElements } from './flexEngine.js';

/**
 * Collect all available elements from the Flex Engine registry.
 */
export function getAllFlexEngineElements() {
    const elements = [];

    for (const [categoryName, category] of Object.entries(flexEngineDefaultElements)) {
        if (!category?.elements) continue;

        for (const [elementName, element] of Object.entries(category.elements)) {
            if (!element || typeof element !== 'object') continue;

            // Skip elements explicitly hidden from the library.
            if (element.settings?.hide === true) continue;

            elements.push({
                category: categoryName,
                key: elementName,
                name: element.name || elementName,
                className: element.className || elementName,
                icon: element.icon || '',
                definition: element
            });
        }
    }

    return elements;
}

/**
 * Create a visual button for a registered element.
 */
export function createContentLibraryButton(element, onSelect = null) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = `rs-content-library-button rs-${element.className}`;

    button.dataset.element = element.key;
    button.dataset.category = element.category;

    // Icon container
    const iconContainer = document.createElement('div');

    iconContainer.className = 'rs-content-library-icon';

    // Icons originate from the trusted internal registry.
    iconContainer.innerHTML = element.icon;

    // Text container
    const label = document.createElement('span');

    label.className = 'rs-content-library-label';
    label.textContent = element.name;

    button.appendChild(iconContainer);
    button.appendChild(label);

    // Selection callback
    button.addEventListener('click', () => {
        if (typeof onSelect === 'function') {
            onSelect(element);
        }
    });

    return button;
}

/**
 * Render all available elements into the Content Library panel.
 */
export function renderContentLibrary(options = {}) {
    const {
        target = '[data-ui-panel="contentLibrary"]',
        onSelect = null
    } = options;

    const tray = typeof target === 'string'
        ? document.querySelector(target)
        : target;

    if (!tray) {
        console.warn('[ContentLibrary] Target panel not found.');
        return null;
    }

    const elements = getAllFlexEngineElements();

    const wrapper = document.createElement('div');
    wrapper.className = 'rs-content-library-wrapper';

    const container = document.createElement('div');
    container.className = 'rs-content-library-grid';

    const fragment = document.createDocumentFragment();

    for (const element of elements) {
        const button = createContentLibraryButton(element, onSelect);
        fragment.appendChild(button);
    }

    container.appendChild(fragment);
    wrapper.appendChild(container);

    // Remove the previous library without deleting unrelated panel content.
    tray.querySelectorAll('.rs-content-library-wrapper').forEach(node => {
        node.remove();
    });

    tray.appendChild(wrapper);

    return {
        tray,
        wrapper,
        container,
        elements,
        count: elements.length
    };
}