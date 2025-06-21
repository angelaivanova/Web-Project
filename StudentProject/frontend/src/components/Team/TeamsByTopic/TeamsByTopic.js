import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../../../custom-axios/axios";
import './TeamsByTopic.css';
import AppRepository from "../../../repository/appRepository";
import authService from "../../../repository/Authentication/auth_service";

function TeamsByTopic() {
    const {topicId} = useParams();
    const navigate = useNavigate();

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem("user"));
    };
    const role = authService.getCurrentUser()?.role;
    console.log("User role:", role);

    const handleDeleteTeam = (teamId) => {
        const confirmed = window.confirm("Are you sure you want to delete this team?");
        if (!confirmed) return;


        AppRepository.deleteTeam(teamId)
            .then(() => {
                setTeams(prevTeams => prevTeams.filter(t => t.id !== teamId));
            })
            .catch((err) => {
                console.error("Failed to delete team:", err);
                alert("Could not delete team. Check console for more info.");
            });
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/teams/topic/${topicId}`)
            .then(res => {
                setTeams(res.data);
                setError(null);
            })
            .catch(err => {
                setError("Failed to load teams.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [topicId]);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status"/>
                <p>Loading teams...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to Home</button>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="container mt-4">
                <h3 className="alert alert-info">No teams found for this topic.</h3>
                <div className="d-flex justify-content-center mb-3 back-button-teams text-center">
                    <button className="btn text-white" onClick={() => navigate(`/subjects`)}>
                        ⬅ Back to Subjects!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5 teams-by-topic-container">
            <div className="text-center title">
                <div className="topic-title-h4">
                    <h4 className="mb-4"><small>Topic: </small><strong>{teams[0]?.topicName || topicId}</strong></h4>
                </div>
                <div className="topic-title-h2">
                    <h2 className="mb-4"><strong>{teams[0]?.subjectName}</strong></h2>
                </div>
            </div>
            <div className="row g-4">
                {teams.map(team => (
                    <div key={team.id} className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100 rounded-4">
                            <div className="card-header bg-primary text-white rounded-top-4 team-name">
                                <h5 className="mb-2">{team.name}</h5>
                            </div>
                            <div className="card-body">
                                <p className="fw-semibold mb-2">Members:</p>
                                <ul className="list-group list-group-flush">
                                    {team.studentIndexes.map(index => (
                                        <li key={index} className="list-group-item px-0">
                                            <i className="bi bi-person-fill text-secondary me-2" /> {index}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {role === "ROLE_PROFESSOR" && (
                            <button
                                className="btn btn-danger btn-sm w-100 delete-team-button"
                                onClick={() => handleDeleteTeam(team.id)}
                            >
                                🗑 Delete Team
                            </button>
                                )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-center mb-3 back-button-teams text-center">
                <button className="btn text-white" onClick={() => navigate(`/subjects`)}>
                    ⬅ Back to Subjects!
                </button>
            </div>
        </div>
    );
}

export default TeamsByTopic;
