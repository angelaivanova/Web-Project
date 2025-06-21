import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppService from '../../../repository/appRepository';

const StudentEdit = ({ onEditStudent }) => {
    const { index } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [formData, updateFormData] = useState({
        index: "",
        name: "",
        lastname: "",
        username: "",
        email: ""
    });

    useEffect(() => {
        AppService.getStudent(index)
            .then(res => setStudent(res.data))
            .catch(err => console.error("Error fetching student:", err));
    }, [index]);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    };

    const onFormSubmit = (e) => {
        e.preventDefault();

        const updatedIndex = formData.index || student.index;
        const name = formData.name || student.name;
        const lastname = formData.lastname || student.lastname;
        const username = formData.username || student.username;
        const email = formData.email || student.email;

        onEditStudent(student.index, name, lastname, username, email);
        navigate("/students");
    };

    if (!student) {
        return <p className="text-center mt-5">Loading student...</p>;
    }

    return (
        <div className="row mt-5">
            <div className="col-md-5">
                <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="index">Index</label>
                        <input type="number"
                               className="form-control"
                               id="index"
                               name="index"
                               placeholder={student.index}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Student name</label>
                        <input type="text"
                               className="form-control"
                               id="name"
                               name="name"
                               placeholder={student.name}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Lastname</label>
                        <input type="text"
                               className="form-control"
                               id="lastname"
                               name="lastname"
                               placeholder={student.lastname}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text"
                               className="form-control"
                               id="username"
                               name="username"
                               placeholder={student.username}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text"
                               className="form-control"
                               id="email"
                               name="email"
                               placeholder={student.email}
                               onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default StudentEdit;
