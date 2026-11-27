
import NewMovie from "../components/features/admin/NewMovie";
import NewShowing from "../components/features/admin/NewShowing";

export default () => ( <>
    <h2>Administración ⚜️</h2>
    <section>
        <h3>Crear película</h3>
        <NewMovie/>
    </section>

    <section>
        <h3>Crear función</h3>
        <NewShowing/>
    </section>
</> );