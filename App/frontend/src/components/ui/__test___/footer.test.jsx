import { describe, expect, mock, test, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
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

import { Footer } from "../footer";

const renderFooter = () => {
    return render(
        <BrowserRouter>
            <Footer />
        </BrowserRouter>
    );
};

describe('Footer Component tests', () => {

    afterEach(() => {
        cleanup();
    });

    test("renders the footer component", () => {
        renderFooter();

        expect(screen.getByText("footer.trademark")).toBeInTheDocument();
        expect(screen.getByTestId("languageButton")).toBeInTheDocument();
        expect(screen.getByText("© 2025 Notely")).toBeInTheDocument();
    });
})