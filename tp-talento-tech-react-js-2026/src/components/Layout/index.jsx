import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

export default ({children}) => (
    <>
        <header>
            <Header></Header>
            <Navbar></Navbar>
        </header>
        <main>
            {children}
        </main>
        <footer>
            <Footer></Footer>
        </footer>
    </>
)
