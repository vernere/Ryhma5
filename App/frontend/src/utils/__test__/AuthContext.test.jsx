import { describe, expect, mock, test, afterEach, beforeEach, spyOn } from "bun:test";
import { render, cleanup, waitFor } from "@testing-library/react";


const mockGetSession = mock(() => Promise.resolve({ data: { session: null }, error: null }));
const mockSignUp = mock(() => Promise.resolve({ data: { user: { id: "123" } }, error: null }));
const mockSignInWithPassword = mock(() => Promise.resolve({ data: { user: { id: "123" } }, error: null }));
const mockSignOut = mock(() => Promise.resolve({ error: null }));
const mockResetPasswordForEmail = mock(() => Promise.resolve({ data: {}, error: null }));
const mockUpdateUser = mock(() => Promise.resolve({ data: { user: { id: "123" } }, error: null }));

let authstateCallback = null;
const mockOnAuthStateChange = mock((callback) => {
    authstateCallback = callback
    return {
        data: {
            subscription: {
                unsubscribe: mock(() => { })
            }
        }
    }
})

const mockQuery = {
    select: mock(function () { return this; }),
    eq: mock(function () { return this; }),
    single: mock(() => Promise.resolve({ data: { id: "user-123" }, error: null }))
}

mock.module("../../lib/supabaseClient", () => ({
    supabase: {
        auth: {
            getSession: mockGetSession,
            signUp: mockSignUp,
            signInWithPassword: mockSignInWithPassword,
            resetPasswordForEmail: mockResetPasswordForEmail,
            signOut: mockSignOut,
            updateUser: mockUpdateUser,
            onAuthStateChange: mockOnAuthStateChange
        },
        from: mock(() => mockQuery)
    }
}));

import { AuthProvider, AuthContext } from "../AuthContext";
import { useContext } from "react";

const TestConsumer = ({ onRender }) => {
    const auth = useContext(AuthContext);
    onRender(auth)
    return <div data-testid="consumer">Consumer</div>
}


describe('AuthProvider component', () => {
    beforeEach(() => {
        mockGetSession.mockClear();
        mockOnAuthStateChange.mockClear();
    });

    afterEach(() => {
        cleanup();
    })

    test('should start with loading state true', () => {
        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        expect(capturedAuth.loading).toBe(true);
        expect(capturedAuth.user).toBe(null);
    });

    test('should fetch session and set loading to false', async () => {
        mockGetSession.mockResolvedValueOnce({
            data: { session: null },
            error: null
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(capturedAuth.loading).toBe(false);
        });

        expect(mockGetSession).toHaveBeenCalledTimes(1);
    });

    test('should set user when session exits', async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        mockGetSession.mockResolvedValueOnce({
            data: { session: { user: mockUser } },
            error: null
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(capturedAuth.user).toEqual(mockUser);
            expect(capturedAuth.loading).toBe(false);
        });
    });

    test('should set up auth state listener', () => {
        render(
            <AuthProvider>
                <div>Test</div>
            </AuthProvider>
        );

        expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
        expect(typeof authstateCallback).toBe("function")
    });

});

describe('Auth listener', () => {
    afterEach(() => {
        cleanup();
    });

    test('should update user on auth state change', async () => {
        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        const newUser = { id: "456", email: "new@example.com" };

        authstateCallback("SIGNED_IN", { user: newUser });

        await waitFor(() => {
            expect(capturedAuth.user).toEqual(newUser);
        });
    });

    test('should set passowordRecovery to true ', async () => {
        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        authstateCallback("PASSWORD_RECOVERY", null);

        await waitFor(() => {
            expect(capturedAuth.passwordRecovery).toBe(true);
        });
    });

    test('should log message on TOKEN_REFRESHED', async () => {
        const consoleLogSpy = spyOn(console, "log").mockImplementation(() => { });

        render(
            <AuthProvider>
                <div>Test</div>
            </AuthProvider>
        );

        authstateCallback("TOKEN_REFRESHED", { user: { id: "123" } });

        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith("Token refreshed, re-establishing subscriptions...");
        });

        consoleLogSpy.mockRestore();
    });
});

describe('signIn', () => {
    afterEach(() => {
        cleanup();
        mockSignInWithPassword.mockClear();
    });

    test('should successfully sign in user', async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        mockSignInWithPassword.mockResolvedValueOnce({
            data: { user: mockUser },
            error: null
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        const result = await capturedAuth.signIn("test@example.com", "password123");

        expect(result).toEqual(mockUser);
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123"
        });
    });

    test('should throw error on signup failure', async () => {
        const mockError = new Error("Signin failed");
        mockSignInWithPassword.mockResolvedValueOnce({
            data: null,
            error: mockError
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        await expect(
            capturedAuth.signIn("test@example.com", "wrongpassword")
        ).rejects.toThrow("Signin failed");
    });

});


describe('signUp', () => {
    afterEach(() => {
        cleanup();
        mockSignUp.mockClear();
    });

    test('should successfully sign up user', async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        mockSignUp.mockResolvedValueOnce({
            data: { user: mockUser },
            error: null
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        const result = await capturedAuth.signUp("test@example.com", "password123");

        expect(result).toEqual(mockUser);
        expect(mockSignUp).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123"
        });
    });

    test('should throw error on signup failure', async () => {
        const mockError = new Error("Signup failed");
        mockSignUp.mockResolvedValueOnce({
            data: null,
            error: mockError
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        await expect(
            capturedAuth.signUp("test@example.com", "password123")
        ).rejects.toThrow("Signup failed");
    });
});

describe('signOut', () => {
    afterEach(() => {
        cleanup();
        mockSignOut.mockClear();
    });

    test('should successfully sign out user', async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        mockGetSession.mockResolvedValueOnce({
            data: { session: { user: mockUser } },
            error: null
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.user).toEqual(mockUser));

        mockSignOut.mockResolvedValueOnce({ error: null });
        await capturedAuth.signOut();

        await waitFor(() => {
            expect(capturedAuth.user).toBe(null);
        });

        expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    test('should throw error on signout failure', async () => {
        const mockError = new Error("Signout failed");
        mockSignOut.mockResolvedValueOnce({ error: mockError });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        await expect(capturedAuth.signOut()).rejects.toThrow("Signout failed")
    });
});

describe('usernameToId', () => {
    afterEach(() => {
        cleanup();
        mockQuery.single.mockClear();
    });

    test('should return user ID for valid username', async () => {
        mockQuery.single.mockResolvedValueOnce({
            data: { id: "user-123" },
            error: null
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        const userId = await capturedAuth.usernameToId("testuser");

        expect(userId).toBe("user-123")
        expect(mockQuery.eq).toHaveBeenCalledWith("username", "testuser");
    });

    test('should return null and logs error when user not found', async () => {
        const consoleErrorSpy = spyOn(console, "error").mockImplementation(() => { })
        const mockError = new Error("User not found");

        mockQuery.single.mockResolvedValueOnce({
            data: null,
            error: mockError
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        const userId = await capturedAuth.usernameToId("noneexistent");

        expect(userId).toBe(null);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching user ID:", mockError);

        consoleErrorSpy.mockRestore()
    });
});

describe('resetPassword', () => {
    afterEach(() => {
        cleanup();
        mockResetPasswordForEmail.mockClear();
    });

    test('should succesfulle send password reset email', async () => {
        const mockData = { message: "Reset email sent" };
        mockResetPasswordForEmail.mockResolvedValueOnce({
            data: mockData,
            error: null
        });

        import.meta.env.VITE_CHANGE_PASSWORD_URL = "https://example.com/change-password"

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        const result = await capturedAuth.resetPassword("test@example.com");

        expect(result).toEqual(mockData);
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
            "test@example.com",
            { redirectTo: "https://example.com/change-password" }
        );
    });

    test('should throw error on reset password failure', async () => {
        const mockError = new Error("Reset failed");
        mockResetPasswordForEmail.mockResolvedValueOnce({
            data: null,
            error: mockError
        });

        let capturedAuth;

        render(
            <AuthProvider>
                <TestConsumer onRender={(auth) => { capturedAuth = auth }} />
            </AuthProvider>
        );

        await waitFor(() => expect(capturedAuth.loading).toBe(false))

        await expect(
            capturedAuth.resetPassword("test@example.com")
        ).rejects.toThrow("Reset failed")
    });
});


