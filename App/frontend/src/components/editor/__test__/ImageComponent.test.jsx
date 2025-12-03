import { describe, expect, test, mock, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Mock NodeViewWrapper from Tiptap
mock.module("@tiptap/react", () => ({
  NodeViewWrapper: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
}));

// Mock lucide-react icons
mock.module("lucide-react", () => ({
  Trash2: ({ size }) => <span data-testid="trash-icon">{size}</span>,
  Move: ({ size, className }) => <span data-testid="move-icon" className={className}>{size}</span>,
}));

import ImageComponent from "../ImageComponent";

describe("ImageComponent", () => {
  const mockNode = {
    attrs: {
      src: "https://example.com/image.jpg",
      alt: "Test image",
      title: "Test title",
      width: 300,
      height: 200,
    },
  };

  const mockDeleteNode = mock(() => {});
  const mockUpdateAttributes = mock(() => {});

  afterEach(() => {
    cleanup();
  });

  test("renders image with correct attributes", () => {
    render(
      <ImageComponent
        node={mockNode}
        deleteNode={mockDeleteNode}
        updateAttributes={mockUpdateAttributes}
      />
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("alt", "Test image");
    expect(image).toHaveAttribute("title", "Test title");
  });

  test("renders delete button", () => {
    render(
      <ImageComponent
        node={mockNode}
        deleteNode={mockDeleteNode}
        updateAttributes={mockUpdateAttributes}
      />
    );

    const deleteButton = screen.getByTitle("Delete image");
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls deleteNode when delete button is clicked", () => {
    const mockDelete = mock(() => {});
    
    render(
      <ImageComponent
        node={mockNode}
        deleteNode={mockDelete}
        updateAttributes={mockUpdateAttributes}
      />
    );

    const deleteButton = screen.getByTitle("Delete image");
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  test("renders resize handle", () => {
    render(
      <ImageComponent
        node={mockNode}
        deleteNode={mockDeleteNode}
        updateAttributes={mockUpdateAttributes}
      />
    );

    const resizeHandle = screen.getByTitle("Resize image");
    expect(resizeHandle).toBeInTheDocument();
  });

  test("renders with default dimensions when not provided", () => {
    const nodeWithoutDimensions = {
      attrs: {
        src: "https://example.com/image.jpg",
        alt: "",
        title: "",
      },
    };

    const { container } = render(
      <ImageComponent
        node={nodeWithoutDimensions}
        deleteNode={mockDeleteNode}
        updateAttributes={mockUpdateAttributes}
      />
    );

    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  test("renders with empty alt and title when not provided", () => {
    const nodeWithoutAltTitle = {
      attrs: {
        src: "https://example.com/image.jpg",
      },
    };

    const { container } = render(
      <ImageComponent
        node={nodeWithoutAltTitle}
        deleteNode={mockDeleteNode}
        updateAttributes={mockUpdateAttributes}
      />
    );

    const image = container.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("title", "");
  });
});
