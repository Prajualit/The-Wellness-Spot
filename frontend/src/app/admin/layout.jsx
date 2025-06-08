export const metadata = {
    title: "Admin Panel | Closer",
    description: "Admin-only dashboard for managing users and stats.",
};

export default function AdminLayout({ children }) {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}
