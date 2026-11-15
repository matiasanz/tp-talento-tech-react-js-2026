import Footer from "./Footer";
import Header from "./Header";

export default ({children}) => (
    <>
        <header>
            <Header></Header>
        </header>
        <main>
            {children}
        </main>
        <footer>
            <Footer></Footer>
        </footer>
    </>
)
