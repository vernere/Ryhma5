export const Footer = ({ className }) => {
    return (
        <>
            <div
                className={`bg-secondary w-full text-black font-roboto-slab p-2 text-center ${className}`}
            >
                <p>
                    <strong>© 2025 Notely</strong> | All rights reserved.
                </p>
            </div>
        </>
    );
};
