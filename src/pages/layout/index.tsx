import Navbar from "./Navbar"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-[100vh]">
            <Navbar />
            {children}
        </div>
    )
}

export default Layout