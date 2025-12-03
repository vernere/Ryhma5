import { describe, expect, mock, test, afterEach, beforeEach } from "bun:test";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";

const mockUpdate = mock(function () { return this; });
const mockEq = mock(() => Promise.resolve({ data: null, error: null }));
const mockFrom = mock(() => ({
    update: mockUpdate,
    eq: mockEq
}));

mock.module("@/lib/supabaseClient", () => ({
    supabase: {
        from: mockFrom
    }
}));

const mockUser = { id: "user-123", email: "test@example.com" };
mock.module("@/hooks/useAuth", () => ({
    useAuth: mock(() => ({
        user: mockUser
    }))
}));

const mockProfile = { language: "en" };
mock.module("@/utils/ProfileContext", () => ({
    useProfile: mock(() => ({
        profile: mockProfile
    }))
}));

const mockChangeLanguage = mock(() => Promise.resolve());
mock.module("react-i18next", () => ({
    useTranslation: mock(() => ({
        i18n: {
            changeLanguage: mockChangeLanguage
        }
    }))
}));

mock.module("reac-icons/cg", () => ({
    CgGlobeAlt: () => <div data-testid="globe-icon">Globe</div>
}))

mock.module("@/i18n/config", () => ({
    languages: {
        EN: "English",
        VN: "Vietnamese",
        KU: "Kurdish",
        SE: "Swedish",
        FI: "Finnish",
        HI: "Hindi",
        UA: "Ukrainian",
        AR: "Arabic"
    }
}))

import { LanguageDropdown, LanguageButton } from "../popups/LanguageDropdown";
import { CgGlobeAlt } from "react-icons/cg";

describe('LanguageDropdown component', () => {
    const mockOnClose = mock(() => { });

    beforeEach(() => {
        mockOnClose.mockClear();
        mockChangeLanguage.mockClear();
        mockUpdate.mockClear();
        mockEq.mockClear();
        mockFrom.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    test('should note', () => {
        render(<LanguageDropdown isOpen={false} onClose={mockOnClose} />)
        expect(screen.queryByTestId("languageList")).toBeNull();
    });

    test('should rebder when isOpen is true', () => {
        render(<LanguageDropdown isOpen={true} onClose={mockOnClose} />)

        const languageList = screen.getByTestId("languageList")
        expect(languageList).toBeDefined();
    });

    test('should remder all available languages', () => {
        render(<LanguageDropdown isOpen={true} onClose={mockOnClose} />)

        expect(screen.getByText("English")).toBeDefined();
        expect(screen.getByText("Vietnamese")).toBeDefined();
        expect(screen.getByText("Kurdish")).toBeDefined();
        expect(screen.getByText("Swedish")).toBeDefined();
        expect(screen.getByText("Finnish")).toBeDefined();
        expect(screen.getByText("Hindi")).toBeDefined();
        expect(screen.getByText("Ukrainian")).toBeDefined();
        expect(screen.getByText("Arabic")).toBeDefined();
    });

    test('should call changeLanguage and update database when language is selected', async () => {
        mockEq.mockResolvedValueOnce({ data: null, error: null });
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({ update: mockUpdate });
        
        render(<LanguageDropdown isOpen={true} onClose={mockOnClose} />)

        const englishOption = screen.getByText("English");
        fireEvent.click(englishOption);

        await waitFor(() => {
            expect(mockFrom).toHaveBeenCalledWith("users");
            expect(mockUpdate).toHaveBeenCalledWith({language: "EN"});
            expect(mockEq).toHaveBeenCalledWith("id", "user-123");
            expect(mockChangeLanguage).toHaveBeenCalledWith("EN");
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        })
    });
})
