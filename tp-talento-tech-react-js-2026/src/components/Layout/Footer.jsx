import EmployeesRepo from "../../js/repositories/employees_repo"
import { useEffect, useState } from "react"

export default () => {
    const [employees, setEmployees] = useState([])

    useEffect(()=>{
        EmployeesRepo.findAll()
            .then(setEmployees)
            .catch(console.error)
    }, [])

    return (
    <>Atendido por
    <ul>
        { employees.map(PersonCard) }
    </ul>
    </>
)}

const PersonCard = ({id, name, lastname, role}) => 

    <li key={id}>
        <h3>{name} {lastname}</h3>
        <h4>-- <i>{role}</i> --</h4>
    </li>
