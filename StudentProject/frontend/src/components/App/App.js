import React, {Component} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Header from "../Header/header";
import AppService from "../../repository/appRepository";

import Login from "../Login/login";
import Register from "../Register/register"

import Subject from "../Subject/SubjectList/subject"
import Professors from "../Professor/ProfessorList/professor"
import Topic from "../Topic/TopicList/topic"
import Student from "../Student/StudentList/student"

import TopicAdd from "../Topic/TopicAdd/topicAdd";
import TopicEdit from "../Topic/TopicEdit/topicEdit";
import ProfessorSubjectsPage from "../ProfessorSubjects/ProfessorSubjectsPage";
import SubjectTopicPage from "../SubjectTopic/SubjectTopicPage";
import CreateTeam from "../Team/CreateTeam/CreateTeam";
import StudentAdd from "../Student/StudentAdd/studentAdd";
import TeamsByTopic from "../Team/TeamsByTopic/TeamsByTopic";
import ProfessorSubjectTopics from "../ProfessorSubjectTopics/ProfessorSubjectTopics"
import StudentEdit from "../Student/StudentEdit/studentEdit";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            professors: [],
            students: [],
            subjects: [],
            topics: [],
            selectedProfessor: null,
            selectedStudent: null,
            selectedSubject: null,
            selectedTopic: null,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.loadProfessors();
        this.loadStudents();
        this.loadSubjects();
        this.loadTopics();
    };

    // ====== PROFESSORS ======//
    loadProfessors = () => {
        AppService.fetchProfessors()
            .then((data) => {
                this.setState({professors: data.data});
            })
            .catch((error) => console.error("Error fetching professors:", error));
    };
    searchProfessors = (name) => {
        AppService.searchProfessorsByName(name)
            .then((data) => {
                this.setState({professors: data.data});
            })
            .catch((error) => console.error("Error searching professors:", error));
    };

    // ====== STUDENTS ======
    loadStudents = () => {

        AppService.fetchStudents()
            .then((data) => {
                this.setState({students: data.data});
            })
            .catch((error) => console.error("Error fetching students:", error));
    };
    addStudent = (index, name, lastname, username, email) => {
        AppService.addStudent(index, name, lastname, username, email)
            .then(() => {
                this.loadStudents();
            })
            .catch((error) => console.error("Error adding student:", error));
    };
    updateStudent = (index, name, lastname, username, email) => {
        AppService.updateStudent(index, name, lastname, username, email)
            .then(() => {
                this.loadStudents();
            })
            .catch((error) => console.error("Error updating student:", error));
    };
    deleteStudent = (index) => {
        AppService.deleteStudent(index)
            .then(() => {
                this.loadStudents();
            })
            .catch((error) => console.error("Error deleting student:", error));
    };
    getStudent= (index) => {
        AppService.getStudent(index)
            .then((data) => {
                this.setState({
                    selectedStudent: data.data,
                });
            })
            .catch((error) => console.error("Error fetching student:", error));
    };



    // ====== SUBJECTS ======
    loadSubjects = () => {
        AppService.fetchSubjects()
            .then((data) => {
                this.setState({subjects: data.data});
            })
            .catch((error) => console.error("Error fetching subjects:", error));
    };
    searchSubjects = (name, semesterType) => {
        AppService.searchSubjects(name, semesterType)
            .then((data) => {
                this.setState({subjects: data.data});
            })
            .catch((error) => console.error("Error searching subjects:", error));
    };

    // ====== TOPICS ======
    loadTopics = () => {
        AppService.fetchTopics()
            .then((data) => {
                this.setState({topics: data.data});
            })
            .catch((error) => console.error("Error fetching topics:", error));
    };

    getTopic = (id) => {
        AppService.getTopic(id)
            .then((data) => {
                this.setState({
                    selectedTopic: data.data,
                });
            })
            .catch((error) => console.error("Error fetching topic:", error));
    };

    addTopic = (name, description, fromDate, toDate, groupCount, membersPerGroup, professorId, subjectId) => {
        AppService.addTopic(name, description, fromDate, toDate, groupCount, membersPerGroup, professorId, subjectId)
            .then(() => {
                this.loadTopics();
            })
            .catch((error) => console.error("Error adding topic:", error));
    };


    updateTopic = (id, name, description, fromDate, toDate, groupCount, membersPerGroup, professorId, subjectId) => {
        AppService.updateTopic(id, name, description, fromDate, toDate, groupCount, membersPerGroup, professorId, subjectId)
            .then(() => {
                this.loadTopics();
            })
            .catch((error) => console.error("Error updating topic:", error));
    };

    deleteTopic = (id) => {
        AppService.deleteTopic(id)
            .then(() => {
                this.loadTopics();
            })
            .catch((error) => console.error("Error deleting topic:", error));
    };

    // ==== TEAM ====
    loadTeams = () => {
        AppService.fetchTeams()
            .then((data) => {
                this.setState({teams: data.data});
            })
            .catch((error) => console.error("Error fetching teams:", error));
    };
    deleteTeam = (id) => {
        AppService.deleteTeam(id)
            .then(() => {
                this.loadTeams();
            })
            .catch((error) => console.error("Error deleting team:", error));
    };
    render() {
        return (
            <Router>
                <Header/>
                <main>
                    <div>
                        <Routes>
                            {/*PROFESSORS*/}
                            <Route
                                path="/professors"
                                element={
                                    <Professors
                                        professors={this.state.professors}
                                        onSearchProfessors={this.searchProfessors}
                                    />
                                }
                            />

                            {/*STUDENTS*/}
                            <Route
                                path="/students"
                                element={
                                    <Student
                                        students={this.state.students}
                                        onEdit={this.getStudent}
                                        onDelete={this.deleteStudent}
                                    />
                                }
                            />
                            <Route
                                path="/students/edit-student/:index"
                                element={
                                    <StudentEdit
                                        student={this.state.selectedStudent}
                                        onEditStudent={this.updateStudent}
                                    />
                                }
                            />
                            <Route
                                path="/students/add-student"
                                element={
                                    <StudentAdd
                                        onAddStudent={this.addStudent}

                                    />
                                }
                            />

                            {/*SUBJECTS*/}
                            <Route
                                path="/subjects"
                                element={
                                    <Subject
                                        subjects={this.state.subjects}
                                        onSearchSubjects={this.searchSubjects}
                                    />
                                }
                            />

                            {/*TOPICS*/}
                            <Route
                                path="/topics"
                                element={
                                    <Topic
                                        topics={this.state.topics}
                                        onEdit={this.getTopic}
                                        onDelete={this.deleteTopic}
                                    />
                                }
                            />
                            {/*TEAMS*/}
                            <Route
                                path="/teams/topic/{topicId}"
                                element={
                                    <TeamsByTopic
                                        teams={this.state.teams}
                                        onDelete={this.deleteTeam}
                                    />
                                }
                            />

                            <Route
                                path="/subject-allocations/:professorId/subjects"
                                element={<ProfessorSubjectsPage/>
                                }
                            />

                            <Route path="/subject-allocations/subjects/:subjectId/topics"
                                   element={<SubjectTopicPage/>
                                   }
                            />

                            <Route
                                path="/subject-allocations/professors/:professorId/subjects/:subjectId/topics/add-topic"
                                element={<TopicAdd
                                    onAddTopic={this.addTopic}/>
                                }
                            />

                            <Route
                                path="/subject-allocations/topics/:id/professors/:professorId/subjects/:subjectId/edit-topic"
                                element={<TopicEdit
                                    topics={this.state.topics}
                                    onEditTopic={this.updateTopic}/>
                                }
                            />

                            <Route
                                path="/teams/create-team/:topicId"
                                element={<CreateTeam/>
                                }
                            />

                            <Route path="/teams/topic/:topicId"
                                   element={<TeamsByTopic/>
                                   }
                            />

                            <Route path="/subject-allocations/professors/:professorId/subjects/:subjectId/topics"
                                   element={<ProfessorSubjectTopics/>
                                   }
                            />

                            {/*PATHS*/}
                            <Route
                                path="/"
                                element={<Navigate to="/subjects"/>
                                }
                            />

                            <Route
                                path="/login"
                                element={<Login/>
                                }
                            />

                            <Route
                                path="/register"
                                element={<Register/>
                                }
                            />
                        </Routes>
                    </div>
                </main>
            </Router>
        );
    }
}

export default App;
