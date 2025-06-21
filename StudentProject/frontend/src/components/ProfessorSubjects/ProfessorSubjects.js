import React, {useEffect, useState} from "react";
import api from "../../custom-axios/axios";
import {useParams, Link, useNavigate} from "react-router-dom";
import './ProfessorSubjects.css';

function ProfessorSubjects({professorId: propProfessorId}) {
    const {professorId: urlProfessorId} = useParams();
    const professorId = propProfessorId || urlProfessorId;

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!professorId) {
            setError("No professor ID provided");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        api
            .get(`/subject-allocations/${professorId}/subjects`)
            .then((res) => {
                setSubjects(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(`Failed to load subjects: ${err.message || 'Unknown error'}`);
                setLoading(false);
            });
    }, [professorId]);

    if (loading) return <div className="text-center mt-4">Loading subjects...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;
    if (!subjects || subjects.length === 0) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    No subjects found for this professor.
                </div>
                <div className="d-flex justify-content-center mb-3 back-button-subjects-by-professor text-center">
                    <button className="btn text-white" onClick={() => navigate(`/professors`)}>
                        ⬅ Back to Professors!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="professor-subjects-container mt-4">
            <div className="professor-subjects-title mb-4">
                <h4 className="mb-4">Subjects <small>by Professor <strong>{professorId}</strong></small></h4>
            </div>
            <div className="row justify-content-center">
                {subjects.map((allocation, index) => {
                    const subject = allocation.subject || allocation.subjectName || 'Unknown Subject';
                    const abbreviation = allocation.abbreviation || allocation.subjectCode || 'N/A';
                    const semester = allocation.semester || 'N/A';
                    const semesterCode = allocation.semesterCode || 'N/A';

                    return (
                        <div key={allocation.id || index}
                             className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
                            <div className="card">
                                <div className="card-header">{subject}</div>
                                <div className="card-body d-flex flex-column">
                                    <h6 className="card-subtitle mb-3">{abbreviation}</h6>
                                    <p className="card-text"><strong>Semester:</strong> {semester}</p>
                                    <p className="card-text"><strong>Subject Code:</strong> {semesterCode}</p>
                                    <Link
                                        to={`/subject-allocations/professors/${professorId}/subjects/${semesterCode}/topics`}
                                        className="topics-button mt-auto"
                                    >
                                        View Topics!
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="d-flex justify-content-center mb-3 back-button-subjects-by-professor text-center">
                <button className="btn text-white" onClick={() => navigate(`/professors`)}>
                    ⬅ Back to Professors!
                </button>
            </div>
        </div>
    );
}

export default ProfessorSubjects;
