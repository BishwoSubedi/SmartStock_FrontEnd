import PublicNavbar from "../components/Navbar/PublicNavbar";
import Footer from "../components/Footer/Footer";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <PublicNavbar />
      <main style={{ minHeight: "70vh" }}>
        {children}
      </main>

      <Footer />
    
    </>
  );
}

export default PublicLayout;
