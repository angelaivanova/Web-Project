import React, { useEffect, useState } from "react";
import authService from "../../repository/Authentication/auth_service";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../custom-axios/axios";
import './ProfessorSubjectTopics.css';

function ProfessorSubjectTopics() {
    const { professorId, subjectId } = useParams();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjectName, setSubjectName] = useState(null);

    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem("user"));
    };
    const role = authService.getCurrentUser()?.role;
    console.log("User role:", role);

    const navigate = useNavigate();

    useEffect(() => {
        if (!professorId || !subjectId) {
            setError("Professor ID or Subject ID missing");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        api
            .get(`/subject-allocations/${professorId}/subjects`)
            .then((res) => {
                const subjects = res.data || [];
                const matchedSubject = subjects.find(
                    (sub) =>
                        sub.abbreviation === subjectId ||
                        sub.subjectCode === subjectId ||
                        sub.semesterCode === subjectId
                );

                if (matchedSubject) {
                    setSubjectName(matchedSubject.subject || matchedSubject.subjectName || "Unknown Subject");
                } else {
                    setSubjectName(null);
                }
            })
            .catch(() => {
                setSubjectName(null);
            });

        api
            .get(`/subject-allocations/professors/${professorId}/subjects/${subjectId}/topics`)
            .then((res) => {
                setTopics(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(`Failed to load topics: ${err.message || "Unknown error"}`);
                setLoading(false);
            });
    }, [professorId, subjectId]);

    const handleDelete = (topicId) => {
        if (window.confirm("Are you sure you want to delete this topic?")) {
            api
                .delete(`/subject-allocations/topics/delete-topic/${topicId}`)
                .then(() => {
                    setTopics((prev) => prev.filter((t) => t.id !== topicId));
                })
                .catch((err) => {
                    alert(`Failed to delete topic: ${err.message || "Unknown error"}`);
                });
        }
    };

    if (loading) return <div className="text-center mt-4">Loading topics...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;

    if (!topics.length)
        return (
            <div className="container mt-2">
                <div className="alert alert-info">No topics found for this subject.</div>
                {role === "ROLE_PROFESSOR" && (
                <Link
                    to={`/subject-allocations/professors/${professorId}/subjects/${subjectId}/topics/add-topic`}
                    className="btn btn-primary pst-add-button"
                >
                    ➕ Add Topic!
                </Link>
                    )}
                <div className="d-flex justify-content-end mb-3 back-button-subjects-by-professor text-center">
                    <button className="btn text-white" onClick={() => navigate(`/subject-allocations/${professorId}/subjects`)}>
                        ⬅ Back to Subjects by Professor!
                    </button>
                </div>
            </div>
        );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 title">
                <div className="professors-subjects-topic-title mb-4">
                    <h4 className="mb-0"><small>Subject: </small><strong>{subjectName || subjectId}</strong></h4>
                </div>
                {role === "ROLE_PROFESSOR" && (
                <Link
                    to={`/subject-allocations/professors/${professorId}/subjects/${subjectId}/topics/add-topic`}
                    className="btn btn-success pst-add-button"
                >
                    ➕ Add Topic
                </Link>
                    )}
            </div>

            <div className="row">
                {topics.map((topic) => (
                    <div key={topic.id} className="col-md-4 mb-4 d-flex justify-content-center">
                        <div className="pst-card card h-100 shadow-sm">
                            <div className="pst-card-header title-field">
                                {topic.name}
                            </div>
                            <div className="pst-card-body card-body d-flex flex-column">
                                <p className="pst-card-text card-text description-field"><span className="description-field-text"> {topic.description}</span></p>
                                <p className="pst-card-text card-text mb-1 date-field">
                                    <strong className="date">From:</strong>{" "}
                                    <span className="date-field-text"> {topic.fromDate ? new Date(topic.fromDate).toLocaleDateString() : "N/A"}</span>
                                </p>
                                <p className="pst-card-text card-text mb-1 date-field">
                                    <strong className="date">To:</strong>{" "}
                                    <span className="date-field-text"> {topic.toDate ? new Date(topic.toDate).toLocaleDateString() : "N/A"}</span>
                                </p>
                                <p className="pst-card-text card-text grups-and-members-field">
                                    <strong>Groups:</strong> <span className="grups-and-members-field-text"> {topic.groupCount} {" "}</span>
                                    <br/>
                                    <strong>Members per Group:</strong> <span className="grups-and-members-field-text"> {topic.membersPerGroup}</span>
                                </p>

                                <div className="pst-button-group mt-auto d-flex flex-column align-items-center">
                                    {role === "ROLE_PROFESSOR" && (
                                        <>
                                    <Link
                                        to={`/subject-allocations/topics/${topic.id}/professors/${professorId}/subjects/${topic.subjectId}/edit-topic`}
                                        className="btn btn-outline-info btn-sm pst-edit-button mt-2"
                                    >
                                        ✏️ Edit!
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm pst-delete-button"
                                        onClick={() => handleDelete(topic.id)}
                                    >
                                        🗑️ Delete!
                                    </button>
                                    </>
                                        )}
                                    {(role === "ROLE_PROFESSOR" || role==="ROLE_STUDENT") && (
                                        <Link
                                        className="btn btn-primary btn-sm pst-choose-topic-button"
                                        to={`/teams/create-team/${topic.id}`}
                                    >
                                        ➕ Choose Topic!
                                    </Link>
                                            )}
                                    <button
                                        className="btn btn-secondary btn-sm pst-view-teams-button"
                                        onClick={() => navigate(`/teams/topic/${topic.id}`)}
                                    >
                                        👥 View Teams!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-end mb-3 back-button-subjects-by-professor text-center">
                <button className="btn text-white" onClick={() => navigate(`/subject-allocations/${professorId}/subjects`)}>
                    ⬅ Back to Subjects by Professor!
                </button>
            </div>
        </div>
    );
}

export default ProfessorSubjectTopics;
