// app/admin/layout.jsx
export const metadata = {
    title: "Admin Panel | Closer",
    description: "Admin-only dashboard for managing users and stats.",
};

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <header className="p-4 bg-white shadow">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </header>
            <main className="p-4">{children}</main>
        </div>
    );
}
