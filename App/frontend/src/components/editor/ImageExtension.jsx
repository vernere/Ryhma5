import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageComponent from './ImageComponent';

export const ImageExtension = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      annotations: {
        default: [],
      },
      filePath: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'custom-image',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['custom-image', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands() {
    return {
      setImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
      updateImageAnnotations: (pos, annotations) => ({ tr, dispatch }) => {
        if (dispatch) {
          tr.setNodeMarkup(pos, null, { ...tr.doc.nodeAt(pos).attrs, annotations });
        }
        return true;
      },
    };
  },
});