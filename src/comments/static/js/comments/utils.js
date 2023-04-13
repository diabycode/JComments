
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


export function login_required () {
    const container = createElement("div", {class: "login_required"})
    container.appendChild(document.querySelector("#login_required").content.cloneNode(true))

    document.body.append(container)

    // container.addEventListener("innerclick", () => {
    //     console.log("Outer click !")
    // })
}

export function showTopReturnBtn () {
    document.querySelector(".to-top").classList.add("show")
}
export function hideTopReturnBtn () {
    document.querySelector(".to-top").classList.remove("show")
}
