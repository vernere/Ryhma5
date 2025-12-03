import { describe, expect, test, mock, afterEach, beforeEach } from "bun:test";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

const mockUsernameToId = mock(() => Promise.resolve("user-123"));
const mockSendCollaborationInvite = mock(() => Promise.resolve());
const mockGetInvitesByNoteId = mock(() => Promise.resolve());

mock.module("@/hooks/useAuth", () => ({
  useAuth: () => ({
    usernameToId: mockUsernameToId,
    user: { id: "current-user-id", username: "currentuser" }
  })
}));

mock.module("@/hooks/useInvitationsStore", () => ({
  useInvitationsStore: () => ({
    sendCollaborationInvite: mockSendCollaborationInvite,
    getInvitesByNoteId: mockGetInvitesByNoteId,
    invitations: []
  })
}));

mock.module("@/hooks/useNotesStore", () => ({
  useNotesStore: () => ({
    selectedNoteId: "note-123",
    collaborators: []
  })
}));

mock.module("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (params?.username) return `${key} ${params.username}`;
      return key;
    }
  })
}));

mock.module("lucide-react", () => ({
  UserRoundPlus: ({ className }) => <span className={className} data-testid="user-icon" />
}));

import { CollaboratorForm } from "../collaborationPopup/CollaboratorForm";

describe("CollaboratorForm Component", () => {
  
  beforeEach(() => {
    mockUsernameToId.mockClear();
    mockSendCollaborationInvite.mockClear();
    mockGetInvitesByNoteId.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders form with input and button", () => {
    render(<CollaboratorForm />);

    expect(screen.getByText("popups.collaborationPopup.title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder")).toBeInTheDocument();
    expect(screen.getByText("popups.collaborationPopup.buttons.invite")).toBeInTheDocument();
  });

  test("submit button is disabled when input is empty", () => {
    render(<CollaboratorForm />);

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    expect(submitButton).toBeDisabled();
  });

  test("submit button is enabled when input has value", () => {
    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "testuser" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    expect(submitButton).not.toBeDisabled();
  });

  test("successfully sends invitation for valid username", async () => {
    mockUsernameToId.mockResolvedValueOnce("user-123");

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "testuser" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUsernameToId).toHaveBeenCalledWith("testuser");
      expect(mockSendCollaborationInvite).toHaveBeenCalledWith("current-user-id", "user-123", "note-123");
      expect(mockGetInvitesByNoteId).toHaveBeenCalledWith("note-123", "current-user-id");
    });
  });

  test("clears input after successful invitation", async () => {
    mockUsernameToId.mockResolvedValueOnce("user-123");

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "testuser" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  test("shows error when trying to invite self", async () => {
    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "currentuser" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("popups.collaborationPopup.errors.selfInvite")).toBeInTheDocument();
    });

    expect(mockUsernameToId).not.toHaveBeenCalled();
  });

  test("shows error when user is not found", async () => {
    mockUsernameToId.mockResolvedValueOnce(null);

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "nonexistent" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("popups.collaborationPopup.errors.userNotFound nonexistent")).toBeInTheDocument();
    });

    expect(mockSendCollaborationInvite).not.toHaveBeenCalled();
  });

  test("shows error when username lookup fails", async () => {
    const consoleErrorSpy = mock(() => {});
    const originalError = console.error;
    console.error = consoleErrorSpy;

    mockUsernameToId.mockImplementationOnce(() => 
      Promise.reject(new Error("Lookup failed"))
    );

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "testuser" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("popups.collaborationPopup.errors.userNotFound testuser")).toBeInTheDocument();
    });

    expect(mockSendCollaborationInvite).not.toHaveBeenCalled();
    
    console.error = originalError;
  });

  test("error clears when typing after error", async () => {
    mockUsernameToId.mockResolvedValueOnce(null);

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "nonexistent" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("popups.collaborationPopup.errors.userNotFound nonexistent")).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "newuser" } });

    expect(screen.queryByText("popups.collaborationPopup.errors.userNotFound nonexistent")).not.toBeInTheDocument();
  });

  test("shows submitting state during invitation", async () => {
    let resolveInvite;
    const slowInvite = new Promise(resolve => { resolveInvite = resolve; });
    mockSendCollaborationInvite.mockReturnValueOnce(slowInvite);
    mockUsernameToId.mockResolvedValueOnce("user-123");

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "testuser" } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("popups.collaborationPopup.buttons.inviting")).toBeInTheDocument();
    });

    resolveInvite();
  });

  test("trims whitespace from username", async () => {
    mockUsernameToId.mockResolvedValueOnce("user-123");

    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "  testuser  " } });

    const submitButton = screen.getByText("popups.collaborationPopup.buttons.invite");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUsernameToId).toHaveBeenCalledWith("testuser");
    });
  });

  test("does not submit when only whitespace", async () => {
    render(<CollaboratorForm />);

    const input = screen.getByPlaceholderText("popups.collaborationPopup.inviteFieldPlaceholder");
    fireEvent.change(input, { target: { value: "   " } });

    const form = screen.getByText("popups.collaborationPopup.title").closest("form");
    fireEvent.submit(form);

    expect(mockUsernameToId).not.toHaveBeenCalled();
  });

  test("renders UserRoundPlus icon", () => {
    render(<CollaboratorForm />);

    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });
});
