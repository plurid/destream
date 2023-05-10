// #region module
/**
 * https://stackoverflow.com/a/71189606
 *
 * @param element
 * @param minW
 * @param minH
 * @param size
 */
export function makeResizable(
    element: HTMLElement,
    minW = 100,
    minH = 100,
    size = 20,
) {
    const top = document.createElement('div');
    top.style.width = '100%';
    top.style.height = size + 'px';
    top.style.backgroundColor = 'transparent';
    top.style.position = 'absolute';
    top.style.top = - (size / 2) + 'px';
    top.style.left = '0px';
    top.style.cursor = 'n-resize';

    top.addEventListener('mousedown', resizeYNegative())

    element.appendChild(top);

    const bottom = document.createElement('div');
    bottom.style.width = '100%';
    bottom.style.height = size + 'px';
    bottom.style.backgroundColor = 'transparent';
    bottom.style.position = 'absolute';
    bottom.style.bottom = - (size / 2) + 'px';
    bottom.style.left = '0px';
    bottom.style.cursor = 'n-resize';

    bottom.addEventListener('mousedown', resizeYPositive())

    element.appendChild(bottom);

    const left = document.createElement('div');
    left.style.width = size + 'px';
    left.style.height = '100%';
    left.style.backgroundColor = 'transparent';
    left.style.position = 'absolute';
    left.style.top = '0px';
    left.style.left = - (size / 2) + 'px';
    left.style.cursor = 'e-resize';

    left.addEventListener('mousedown', resizeXNegative())

    element.appendChild(left);

    const right = document.createElement('div');
    right.style.width = size + 'px';
    right.style.height = '100%';
    right.style.backgroundColor = 'transparent';
    right.style.position = 'absolute';
    right.style.top = '0px';
    right.style.right = - (size / 2) + 'px';
    right.style.cursor = 'e-resize';

    right.addEventListener('mousedown', resizeXPositive())

    element.appendChild(right);


    const corner1 = document.createElement('div');
    corner1.style.width = size + 'px';
    corner1.style.height = size + 'px';
    corner1.style.backgroundColor = 'transparent';
    corner1.style.position = 'absolute';
    corner1.style.top = - (size / 2) + 'px';
    corner1.style.left = - (size / 2) + 'px';
    corner1.style.cursor = 'nw-resize';

    corner1.addEventListener('mousedown', resizeXNegative())
    corner1.addEventListener('mousedown', resizeYNegative())

    element.appendChild(corner1);

    const corner2 = document.createElement('div');
    corner2.style.width = size + 'px';
    corner2.style.height = size + 'px';
    corner2.style.backgroundColor = 'transparent';
    corner2.style.position = 'absolute';
    corner2.style.top = - (size / 2) + 'px';
    corner2.style.right = - (size / 2) + 'px';
    corner2.style.cursor = 'ne-resize';

    corner2.addEventListener('mousedown', resizeXPositive())
    corner2.addEventListener('mousedown', resizeYNegative())

    element.appendChild(corner2);

    const corner3 = document.createElement('div');
    corner3.style.width = size + 'px';
    corner3.style.height = size + 'px';
    corner3.style.backgroundColor = 'transparent';
    corner3.style.position = 'absolute';
    corner3.style.bottom = - (size / 2) + 'px';
    corner3.style.left = - (size / 2) + 'px';
    corner3.style.cursor = 'sw-resize';

    corner3.addEventListener('mousedown', resizeXNegative())
    corner3.addEventListener('mousedown', resizeYPositive())

    element.appendChild(corner3);

    const corner4 = document.createElement('div');
    corner4.style.width = size + 'px';
    corner4.style.height = size + 'px';
    corner4.style.backgroundColor = 'transparent';
    corner4.style.position = 'absolute';
    corner4.style.bottom = - (size / 2) + 'px';
    corner4.style.right = - (size / 2) + 'px';
    corner4.style.cursor = 'se-resize';

    corner4.addEventListener('mousedown', resizeXPositive())
    corner4.addEventListener('mousedown', resizeYPositive())

    element.appendChild(corner4);

    function get_int_style(key: any) {
        return parseInt(window.getComputedStyle(element).getPropertyValue(key));
    }

    function resizeXPositive() {
        let offsetX: any
        function dragMouseDown(e: any) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const { clientX } = e;
            offsetX = clientX - element.offsetLeft - get_int_style('width');
            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
        }

        function elementDrag(e: any) {
            const { clientX } = e;
            let x = clientX - element.offsetLeft - offsetX
            if (x < minW) x = minW;
            element.style.width = x + 'px';
        }

        function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

    function resizeYPositive() {
        let offsetY: any
        function dragMouseDown(e: any) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const { clientY } = e;
            offsetY = clientY - element.offsetTop - get_int_style('height');

            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
        }

        function elementDrag(e: any) {
            const { clientY } = e;
            let y = clientY - element.offsetTop - offsetY;
            if (y < minH) y = minH;
            element.style.height = y + 'px';
        }

        function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

    function resizeXNegative() {
        let offsetX: any;
        let startX: any;
        let startW: any;
        let maxX: any;
        function dragMouseDown(e: any) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const { clientX } = e;
            startX = get_int_style('left')
            startW = get_int_style('width')
            offsetX = clientX - startX;
            maxX = startX + startW - minW

            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
        }

        function elementDrag(e: any) {
            const { clientX } = e;
            let x = clientX - offsetX
            let w = startW + startX - x
            if (w < minW) w = minW;
            if (x > maxX) x = maxX;
            element.style.left = x + 'px';
            element.style.width = w + 'px';
        }

        function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }

    function resizeYNegative() {
        let offsetY: any;
        let startY: any;
        let startH: any;
        let maxY: any;
        function dragMouseDown(e: any) {
            if (e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const { clientY } = e;
            startY = get_int_style('top')
            startH = get_int_style('height')
            offsetY = clientY - startY;
            maxY = startY + startH - minH

            document.addEventListener('mouseup', closeDragElement, false)
            document.addEventListener('mousemove', elementDrag, false)
        }

        function elementDrag(e: any) {
            const { clientY } = e;
            let y = clientY - offsetY
            let h = startH + startY - y
            if (h < minH) h = minH;
            if (y > maxY) y = maxY;
            element.style.top = y + 'px';
            element.style.height = h + 'px';
        }

        function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
        return dragMouseDown
    }
}


export const styleView = (
    view: HTMLElement,
) => {
    view.style.display = 'block';
    view.style.position = 'fixed';
    view.style.background = '#494f5a';
    view.style.width = '560px';
    view.style.height = '330px';
    view.style.bottom = '10px';
    view.style.right = '10px';
    view.style.zIndex = '999999';
}


export const styleSplitStream = (
    stream: HTMLElement,
) => {
    stream.style.width = '100%';
    stream.style.height = '100%';
    stream.style.display = 'grid';
    stream.style.gridTemplateColumns = '3fr 1fr';
}


export const styleFullStream = (
    stream: HTMLElement,
) => {
    stream.style.width = '100%';
    stream.style.height = '100%';
    stream.style.display = 'grid';
    stream.style.gridTemplateColumns = '1fr';
}


export const createIframe = (
    name: string,
    stream: HTMLElement,
) => {
    const iframe = document.createElement('iframe');
    iframe.id = `destream-${name}-iframe`;
    stream.appendChild(iframe);
    styleIframe(iframe);

    return iframe;
}


export const styleIframe = (
    iframe: HTMLElement,
) => {
    iframe.style.width = '100%';
    iframe.style.height = '100%';
}
// #endregion module
