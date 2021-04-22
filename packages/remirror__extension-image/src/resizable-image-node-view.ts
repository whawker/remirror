import { isNumber, isString, throttle } from '@remirror/core';
import { NodeView, ProsemirrorNode } from '@remirror/pm';
import { EditorView } from '@remirror/pm/view';

type CreateElement = (props: {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: () => number;
}) => HTMLElement;

/**
 * ResizableNodeView is a base NodeView for resizable element. You can resize the
 * DOM element by dragging the handle over the image.
 *
 * @param node - the node which uses this nodeView. Must have `width` and `height` in the attrs.
 * @param view - the editor view used by this nodeView.
 * @param getPos - a utility method to get the absolute cursor position of the node
 * @param createElement - a function to get the inner DOM element for this prosemirror node
 */
export class ResizableNodeView implements NodeView {
  dom: HTMLElement;
  readonly inner: HTMLElement;
  node: ProsemirrorNode;

  // cache the current element's size so that we can compare with new node's
  // size when `update` method is called.
  width = '';

  constructor({
    node,
    view,
    getPos,
    createElement,
  }: {
    node: ProsemirrorNode;
    view: EditorView;
    getPos: () => number;
    createElement: CreateElement;
  }) {
    const outer = document.createElement('div');
    outer.style.position = 'relative';
    outer.style.width = node.attrs.width;
    outer.style.maxWidth = '100%';
    outer.style.minWidth = '50px';
    outer.style.display = 'inline-block';
    outer.style.lineHeight = '0'; // necessary so the bottom right handle is aligned nicely
    outer.style.transition = 'width 0.15s ease-out, height 0.15s ease-out'; // make sure transition time is larger then mousemove event's throttle time

    const inner = createElement({ node, view, getPos });

    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.bottom = '0px';
    handle.style.right = '0px';
    handle.style.width = '10px';
    handle.style.height = '10px';
    handle.style.border = '3px solid black';
    handle.style.borderTop = 'none';
    handle.style.borderLeft = 'none';
    handle.style.display = 'none';
    handle.style.zIndex = '100';
    handle.style.cursor = 'nwse-resize';

    outer.addEventListener('mouseover', () => {
      handle.style.display = '';
    });

    outer.addEventListener('mouseout', () => {
      handle.style.display = 'none';
    });

    handle.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();

      const startX = e.pageX;

      const startWidth = getWidthFromNode(this.node) || getSizeFromDom(inner)[0];

      const onMouseMove = throttle(100, false, (e: MouseEvent) => {
        const currentX = e.pageX;

        const diffX = currentX - startX;
        outer.style.width = `${startWidth + diffX}px`;
      });

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const transaction = view.state.tr.setNodeMarkup(getPos(), undefined, {
          src: node.attrs.src,
          width: outer.style.width,
        });

        this.width = outer.style.width;

        view.dispatch(transaction);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    outer.append(handle);
    outer.append(inner);

    this.dom = outer;
    this.inner = inner;
    this.node = node;
  }

  update(node: ProsemirrorNode): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    for (const key of Object.keys(node.attrs)) {
      if (
        key !== 'width' &&
        (node.attrs[key] || this.node.attrs[key]) &&
        node.attrs[key] !== this.node.attrs[key]
      ) {
        return false;
      }
    }

    if (node.attrs.width === this.width) {
      this.node = node;
      return true;
    }

    this.node = node;
    this.width = node.attrs.width;

    this.inner.style.width = node.attrs.width;
    return true;
  }
}

const createInnerImage: CreateElement = ({ node }) => {
  const inner = document.createElement('img');
  inner.setAttribute('src', node.attrs.src);
  inner.style.width = '100%';
  inner.style.minWidth = '50px';
  inner.style.objectFit = 'contain'; // maintain image's aspect ratio
  return inner;
};

/**
 * ResizableImageView is a NodeView for image. You can resize the image by
 * dragging the handle over the image.
 */
export class ResizableImageView extends ResizableNodeView implements NodeView {
  constructor(node: ProsemirrorNode, view: EditorView, getPos: () => number) {
    super({ node, view, getPos, createElement: createInnerImage });
  }
}

function getWidthFromNode(node: ProsemirrorNode): number {
  const width = node.attrs.width;

  if (isNumber(width)) {
    return width;
  }

  if (isString(width)) {
    const w = width.match(/(\d+)px/)?.[0];

    if (w) {
      return Number.parseFloat(w);
    }
  }

  return 0;
}

function getSizeFromDom(element: HTMLElement | null): [number, number] {
  if (!element) {
    return [0, 0];
  }

  const rect = element.getBoundingClientRect();
  return [rect.width, rect.height];
}
