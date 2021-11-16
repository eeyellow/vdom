const render = (vNode) => {
    const el = document.createElement(vNode.tagName);

    //set attributes
    for (const [k, v] of Object.entries(vNode.attrs)) {
        el.setAttribute(k, v);
    }

    //set children
    for (const child of vNode.children) {
        el.appendChild(render(child));
    }

    return el;
};

export default render;
