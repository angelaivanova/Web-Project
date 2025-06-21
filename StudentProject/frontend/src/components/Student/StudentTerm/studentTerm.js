import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import authService from "../../../repository/Authentication/auth_service";

const StudentTerm = (props) => {
    const role = authService.getCurrentUser()?.role;
    console.log("User role:", role);

    const navigate = useNavigate();

    const handleEditClick = async () => {
        await props.onEdit(props.term.index);
        navigate(`/students/edit-student/${props.term.index}`);
    };
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            props.onDelete(props.term.id);
        }
    };


    return (
        <tr>
            <td>{props.term.index}</td>
            <td>{props.term.name}</td>
            <td>{props.term.lastname}</td>
            <td>{props.term.username}</td>
            <td>{props.term.email}</td>

            <td className="text-right">
                {role === "ROLE_ADMIN" && (
                    <>
                        <button
                            className="btn btn-danger"
                            title="Delete"
                            onClick={() => props.onDelete(props.term.index)}
                        >
                            Delete
                        </button>
                        <button className="btn btn-info ml-2" onClick={handleEditClick}>
                            Edit
                        </button>
                    </>
                        )}
            </td>
        </tr>
    );
};

export default StudentTerm;
