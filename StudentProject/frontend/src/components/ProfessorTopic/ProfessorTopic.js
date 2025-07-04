import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import api from "../../custom-axios/axios";

function ProfessorTopics({professorId: propProfessorId, subjectId: propSubjectId}) {
    const {professorId: urlProfessorId} = useParams();
    const professorId = propProfessorId || urlProfessorId;
    const {subjectId: urlSubjectId} = useParams();
    const subjectId = propSubjectId || urlSubjectId;

    const [topics, setTopics] = useState([]);
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

    const handleChooseTopic = (topicId) => {
        navigate(`/teams/create-team/${topicId}`);
    };

    if (loading) return <div className="text-center mt-4">Loading topics...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;
    if (!topics.length)
        return (
            <div className="container mt-4">
                <div className="alert alert-info">No topics found for this professor.</div>
            </div>
        );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Professor's Topics</h2>
            <div className="row">
                {topics.map((topic) => (
                    <div key={topic.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{topic.name}</h5>
                                <p className="card-text">{topic.description}</p>
                                <p className="card-text mb-1">
                                    <strong>From:</strong>{" "}
                                    {topic.fromDate ? new Date(topic.fromDate).toLocaleDateString() : "N/A"}
                                </p>
                                <p className="card-text mb-1">
                                    <strong>To:</strong>{" "}
                                    {topic.toDate ? new Date(topic.toDate).toLocaleDateString() : "N/A"}
                                </p>
                                <p className="card-text">
                                    <strong>Groups:</strong> {topic.groupCount} |{" "}
                                    <strong>Members per Group:</strong> {topic.membersPerGroup}
                                </p>
                                <Link
                                    to={`/subject-allocations/topics/${topic.id}/professors/${professorId}/subjects/${topic.subjectId}/edit-topic`}
                                    className="btn btn-info mt-auto"
                                >
                                    Edit Topic
                                </Link>
                                <Link
                                    className="btn btn-info mt-auto"
                                    onClick={() => handleDelete(topic.id)}
                                >
                                    Delete Topic
                                </Link>
                                <Link
                                    className="btn btn-primary"
                                    to={`/teams/create-team/${topic.id}`}
                                >
                                    Choose Topic
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfessorTopics;
