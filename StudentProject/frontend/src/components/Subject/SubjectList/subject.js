import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import SubjectTerm from '../SubjectTerm/subjectTerm';
import './subject.css';

const Subject = ({ subjects, onSearchSubjects }) => {
    const [page, setPage] = useState(0);
    const [name, setName] = useState("");
    const [semesterType, setSemesterType] = useState("");

    const size = 12;

    const handlePageClick = (data) => {
        setPage(data.selected);
    };

    const getSubjectPage = (offset, nextPageOffset) => {
        return subjects
            .slice(offset, nextPageOffset)
            .map((term, index) => <SubjectTerm key={term.id || index} term={term} />);
    };

    const handleInputChange = (e) => {
        const { name: fieldName, value } = e.target;
        if (fieldName === 'name') {
            setName(value);
        } else if (fieldName === 'semesterType') {
            setSemesterType(value);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearchSubjects(name, semesterType);
        setPage(0);
    };

    const offset = size * page;
    const nextPageOffset = offset + size;
    const pageCount = Math.ceil(subjects.length / size);
    const subjectElements = getSubjectPage(offset, nextPageOffset);

    return (
        <div className="container mt-5">
            <div className="subjects-title mb-4">
                <h2>Subjects</h2>
            </div>

            <form className="search-form mb-4" onSubmit={handleSearchSubmit}>
                <div className="row align-items-center g-2">
                    <div className="col-md-5">
                        <label className="form-label mb-1">Subject Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter name..."
                            value={name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label mb-1">Semester Type</label>
                        <select
                            className="form-select"
                            name="semesterType"
                            value={semesterType}
                            onChange={handleInputChange}
                        >
                            <option value="">All</option>
                            <option value="SUMMER">SUMMER</option>
                            <option value="WINTER">WINTER</option>
                        </select>
                    </div>

                    <div className="col-md-3 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100">
                            Search!
                        </button>
                    </div>
                </div>
            </form>

            <div className="row">
                {subjectElements}
            </div>

            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={<span className="mx-2">...</span>}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
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
};

export default Subject;