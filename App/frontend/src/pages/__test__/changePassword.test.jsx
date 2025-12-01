import { describe, expect, mock, test, afterEach } from "bun:test";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = mock(() => { });
const mockChangePassword = mock(() => Promise.resolve());
const mockSignOut = mock(() => Promise.resolve());

mock.module("react-router", () => ({
    useNavigate: () => mockNavigate,
}));

mock.module("../../hooks/useAuth", () => ({
    useAuth: () => ({
        changePassword: mockChangePassword,
        signOut: mockSignOut,
        passwordRecovery: true
    }),
}));

mock.module("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

mock.module("@/components/ui/header.jsx", () => ({
    Header: () => <div data-testid="header">Header</div>
}));

mock.module("@/components/ui/footer.jsx", () => ({
    Footer: () => <div data-testid="footer">Footer</div>
}));

mock.module("@/components/ui/input.jsx", () => ({
    Input: ({ placeholder, type, value, onChange, className }) => (
        <input
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            className={className}
        />
    )
}));

mock.module("@/components/ui/button.jsx", () => ({
    Button: ({ children, onClick, className }) => (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    )
}));

// This has to be here, otherwise it wont load correctly
import ChangePassword from "../changePassword";

const renderChangePassword = () => {
    return render(
        <BrowserRouter>
            <ChangePassword />
        </BrowserRouter>
    );
};

describe("ChangePassword Component", () => {

    afterEach(() => {
        cleanup();
    });

    const fillPasswordForm = (newPass, confirmPass) => {
        fireEvent.change(screen.getByPlaceholderText("placeholders.newPassword"),
            { target: { value: newPass } });
        fireEvent.change(screen.getByPlaceholderText("placeholders.confirmPassword"),
            { target: { value: confirmPass } });
        fireEvent.click(screen.getByText("password.change.updateButton"));
    }

    test("renders the change password form", () => {
        renderChangePassword();

        expect(screen.getByText("password.change.title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("placeholders.newPassword")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("placeholders.confirmPassword")).toBeInTheDocument();
        expect(screen.getByText("password.change.updateButton")).toBeInTheDocument();
    });

    test('should error for invalid password format', async () => {
        renderChangePassword();

        fillPasswordForm("weak", "weak")

        await waitFor(() => {
            expect(screen.getByText("password.change.validPasswordError")).toBeInTheDocument();
        })
    })

    test('should error when passwords dont match', async () => {
        renderChangePassword();

        fillPasswordForm("ValidPass1", "DifferentPass1")

        await waitFor(() => {
            expect(screen.getByText("password.change.passwordMatchError")).toBeInTheDocument();
        })
    })

    test('should accept valid password that meets requirements', async () => {
        renderChangePassword();

        fillPasswordForm("ValidPass123", "ValidPass123")

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith("ValidPass123");
        })
    })
});
