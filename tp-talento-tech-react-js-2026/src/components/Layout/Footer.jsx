const importantPeople = [
    {
        id: 1,
        name: 'Natalio',
        lastname: 'Ruiz',
        role: 'Socio'
    },
    {
        id: 2,
        name: 'Mariel',
        lastname: 'Capitán',
        role: 'Socia'
    },
    {
        id: 3,
        name: 'Salvador',
        lastname: 'Tijeras',
        role: 'Gerente'
    },
    {
        id: 4,
        name: 'Cassandra',
        lastname: 'Alsol',
        role: 'Atención Candybar'
    }
]

export default () => (
    <>Atendido por
    <ul>
        { importantPeople.map(PersonCard) }
    </ul>
    </>
)

const PersonCard = ({id, name, lastname, role}) => 

    <li key={id}>
        <h3>{name} {lastname}</h3>
        <h4>-- <i>{role}</i> --</h4>
    </li>
