import React from 'react';
import {Link} from 'react-router-dom';
import authService from "../../../repository/Authentication/auth_service";

const TopicTerm = (props) => {
    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem("user"));
    };
    const role = authService.getCurrentUser()?.role;
    console.log("User role:", role);
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            props.onDelete(props.term.id);
        }
    };
    return (
        <tr>
            <td>{props.term.name}</td>
            <td>{props.term.description}</td>
            <td>{props.term.fromDate}</td>
            <td>{props.term.toDate}</td>
            <td>{props.term.groupCount}</td>
            <td>{props.term.membersPerGroup}</td>
            <td>{props.term.professors?.name || props.term.professorId}</td>
            <td>{props.term.subject?.name || props.term.subjectId}</td>

            <td className={"text-right"}>
                {role === "ROLE_PROFESSOR" && (
                    <>
                <a title={"Delete"} className={"btn btn-danger"}
                   onClick={() => props.onDelete(props.term.id)}>
                    Delete
                </a>

                <Link className={"btn btn-info ml-2"}
                      onClick={() => props.onEdit(props.term.id)}
                      to={`/subject-allocations/topics/${props.term.id}/professors/${props.term.professorId}/subjects/${props.term.subjectId}/edit-topic`}>
                    Edit
                </Link>
                    </>
                )}
            </td>

        </tr>
    )
}

export default TopicTerm;
