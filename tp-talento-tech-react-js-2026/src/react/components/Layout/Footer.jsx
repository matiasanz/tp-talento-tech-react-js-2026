import employeesRepo from "../../../js/repositories/employees_repo"
import { useEffect, useState } from "react"
import { useErrorHandler } from "../../context/error_handler"

export default () => {
    const [employees, setEmployees] = useState([])
    const {handleError} = useErrorHandler()

    useEffect(()=>{
        employeesRepo.findAll()
            .then(setEmployees)
            .catch(handleError)
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
