import render from "./render";

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];

    // set new attributes
    for (const [k, v] of Object.entries(newAttrs)) {
        if (oldAttrs[k] !== v) {
            patches.push(node => {
                node.setAttribute(k, v);
                return node;
            });
        }
    }

    // remove old attributes
    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push(node => {
                node.removeAttribute(k);
                return node;
            });
        }
    }

    return node => {
        for (const patch of patches) {
            patch(node);
        }
    }
}

const diff = (vOldNode, vNewNode) => {
    if (vNewNode === undefined) {
        return node => {
            node.remove();
            return undefined;
        }
    }

    if (typeof vOldNode === 'string' || typeof vNewNode === 'number') {
        if (vOldNode !== vNewNode) {
            return node => {
                const newNode = render(vNewNode);
                node.replaceWith(newNode);
                return newNode;
            }
        }
        else {
            return node => undefined;
        }
    }

    if(vOldNode.tagName !== vNewNode.tagName) {
        return node => {
            const newNode = render(vNewNode);
            node.replaceWith(newNode);
            return newNode;
        }
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);

    return node => {
        patchAttrs(node);
        return node;
    }
};

export default diff;