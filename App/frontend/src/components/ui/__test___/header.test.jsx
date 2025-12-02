import { describe, expect, mock, test, afterEach } from "bun:test";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";


mock.module('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => (key),
    }),
}));

mock.module("@/components/ui/popups/LanguageDropdown", () => ({
    LanguageButton: () => <div data-testid="languageButton">Language Button</div>
}))

mock.module("@/utils/ProfileContext", () => ({
    useProfile: () => ({
        profile:{
            language: "en"
        }
    })
}));

mock.module("@/hooks/useAuth", () => ({
    useAuth: () => ({
        user:{
            id: "test-user-id"
        }
    })
}));

import { Header } from "../header";

const renderHeader = () => {
    return render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    );
};

describe('Header Component tests', () => {

    afterEach(() => {
        cleanup();
    });

    test("renders the header component", () => {
        renderHeader();

        expect(screen.getByText("header.buttons.login")).toBeInTheDocument();
        expect(screen.getByText("header.buttons.register")).toBeInTheDocument();
        expect(screen.getByText("Notely")).toBeInTheDocument();
        expect(screen.getByTestId("landingLink")).toHaveAttribute("href", "/");
        expect(screen.getByTestId("loginLink")).toHaveAttribute("href", "/login");
        expect(screen.getByTestId("registerLink")).toHaveAttribute("href", "/register");
    });
})