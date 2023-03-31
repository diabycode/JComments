
/**
 * Create element with attributes
 */
export function createElement(tag, attributes) {
    var element = document.createElement(tag);
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}
