import render from "./render";

const zip = (a, b) => {
    const result = [];
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        result.push([a[i], b[i]]);
    }
    return result;
}

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

const diffChildren = (oldChildren, newChildren) => {
    const patches = [];

    for (const [oldChild, newChild] of zip(oldChildren, newChildren)) {
        patches.push(diff(oldChild, newChild));
    }

    const additionalPatches = [];
    for (const additionalChild of newChildren.slice(oldChildren.length)) {
        additionalPatches.push(node => {
            node.appendChild(render(additionalChild));
            return node;
        });
    }


    return parent => {
        for (const [patch, child] of zip(patches, parent.childNodes)) {
            patch(child);
        }
        for(const patch of additionalPatches) {
            patch(parent);
        }
        return parent;
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
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

    return node => {
        patchAttrs(node);
        patchChildren(node);
        return node;
    }
};

export default diff;