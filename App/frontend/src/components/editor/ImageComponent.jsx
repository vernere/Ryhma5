import { NodeViewWrapper } from "@tiptap/react";
import { Trash2, Move } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import PropTypes from 'prop-types';


export default function ImageComponent({ node, deleteNode, updateAttributes }) {
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || 'auto',
    height: node.attrs.height || 'auto'
  });

  ImageComponent.propTypes = {
    node: PropTypes.object.isRequired,
    deleteNode: PropTypes.func.isRequired,
    updateAttributes: PropTypes.func
  };


  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = containerRef.current?.offsetWidth || 0;
    const startHeight = containerRef.current?.offsetHeight || 0;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(100, startWidth + deltaX);
      const newHeight = Math.max(100, startHeight + deltaY);

      setDimensions({
        width: newWidth,
        height: newHeight
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (updateAttributes) {
        updateAttributes({
          width: dimensions.width,
          height: dimensions.height
        });
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, updateAttributes]);

  return (
    <NodeViewWrapper className="my-4">
      <div
        ref={containerRef}
        className="relative inline-block group"
        style={{
          width: dimensions.width,
          height: dimensions.height
        }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          title={node.attrs.title || ""}
          className="w-full h-full object-contain rounded-md"
          loading="lazy"
          style={{
            width: dimensions.width,
            height: dimensions.height
          }}
        />

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={deleteNode}
            className="p-2 rounded-lg shadow-md bg-white text-red-600 hover:bg-red-50"
            title="Delete image"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div
          className={`absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-tl-lg cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity ${isResizing ? 'opacity-100' : ''
            }`}
          onMouseDown={handleMouseDown}
          title="Resize image"
        >
          <Move size={12} className="absolute top-0 left-0 text-white" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
