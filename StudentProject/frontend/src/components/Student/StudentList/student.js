import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import StudentTerm from '../StudentTerm/studentTerm';
import authService from "../../../repository/Authentication/auth_service";
import './student.css';

class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            searchText: ''
        };
    }

    handlePageClick = (data) => {
        this.setState({ page: data.selected });
    };

    handleSearchChange = (e) => {
        const newSearchText = e.target.value;
        this.setState({ searchText: newSearchText, page: 0 });
    };

    getStudentPage = (offset, nextPageOffset, filteredStudents) => {
        return filteredStudents
            .slice(offset, nextPageOffset)
            .map((term, index) => (
                <StudentTerm
                    key={term.id || index}
                    term={term}
                    onDelete={this.props.onDelete}
                    onEdit={this.props.onEdit}
                />
            ));
    };

    render() {
        const { size, page, searchText } = this.state;

        const filteredStudents = this.props.students.filter(student =>
            (student.name + " " + student.lastname).toLowerCase().includes(searchText.toLowerCase())
        );

        const offset = size * page;
        const nextPageOffset = offset + size;
        const pageCount = Math.ceil(filteredStudents.length / size);
        const students = this.getStudentPage(offset, nextPageOffset, filteredStudents);

        const role = authService.getCurrentUser()?.role;

        return (
            <div className="container student-container mt-5">
                <div className="students-title mb-4 text-center">
                    <h2>Students</h2>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search students by name..."
                        value={searchText}
                        onChange={this.handleSearchChange}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-dark">
                        <thead>
                        <tr>
                            <th>Index</th>
                            <th>Name</th>
                            <th>Lastname</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>{students}</tbody>
                    </table>
                </div>

                {role === "ROLE_ADMIN" && (
                    <div className="mb-3 text-center">
                        <Link className="btn btn-dark" to="/students/add-student">
                            Add new Student
                        </Link>
                    </div>
                )}

                <div className="d-flex justify-content-center">
                    <ReactPaginate
                        previousLabel={"←"}
                        nextLabel={"→"}
                        breakLabel={<span className="mx-2">...</span>}
                        pageCount={pageCount}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        );
    }
}

export default Student;
