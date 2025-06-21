import axios from '../custom-axios/axios';

const AppRepository = {

    // ====== PROFESSORS ======
    fetchProfessors: () => {
        return axios.get("/professors");
    },
    searchProfessorsByName: (name) => {
        return axios.get("/professors/search-professor", {
            params: {
                name: name
            }
        });
    },

    // ====== STUDENTS ======
    fetchStudents: () => {
        return axios.get("/students");
    },
    getStudent: (id) => {
        return axios.get(`/students/${id}`);
    },

    addStudent: (index, name, lastname, username, email) => {
        return axios.post("/students/add-student", {
            "index": index,
            "name": name,
            "lastname": lastname,
            "username": username,
            "email": email
        });
    },
    // TODO
    updateStudent: (index, name, lastname, username, email) => {
        return axios.put(`/students/edit-student/${index}`, {
            "name": name,
            "lastname": lastname,
            "username": username,
            "email": email
        });
    },
    // TODO
    deleteStudent: (index) => {
        return axios.delete(`/students/delete-student/${index}`);
    },

    // ====== SUBJECTS ======
    fetchSubjects: () => {
        return axios.get("/subjects");
    },
    searchSubjects: (name, semesterType) => {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (semesterType) params.append("semesterType", semesterType);

        return axios.get(`/subjects/search-subject?${params.toString()}`);
    },

    // ====== TOPICS ======
    fetchTopics: () => {
        return axios.get("/subject-allocations/topics");
    },

    getTopic: (id) => {
        return axios.get(`/topics/${id}`);
    },

    addTopic: (name, description, fromDate, toDate, groupCount, membersPerGroup, professorId, subjectId) => {
        return axios.post(`/subject-allocations/professors/${professorId}/subjects/${subjectId}/topics/add-topic`, {
            "name": name,
            "description": description,
            "fromDate": fromDate,
            "toDate": toDate,
            "groupCount": groupCount,
            "membersPerGroup": membersPerGroup,
            "professorId": professorId,
            "subjectId": subjectId
        });
    },

    updateTopic: (id, name, description, fromDate, toDate, groupCount, membersPerGroup, professorId, subjectId) => {
        return axios.put(`subject-allocations/topics/${id}/professors/${professorId}/subjects/${subjectId}/edit-topic`, {
            "name": name,
            "description": description,
            "fromDate": fromDate,
            "toDate": toDate,
            "groupCount": groupCount,
            "membersPerGroup": membersPerGroup,
            "professorId": professorId,
            "subjectId": subjectId
        });
    },

    deleteTopic: (id) => {
        return axios.delete(`subject-allocations/topics/delete-topic/${id}`);
    },

    // ====== TEAMS ======
    fetchTeams: () => {
        return axios.get("/teams/topic/{topicId}");
    },
    createTeam: (topicId, name, studentIds) => {
        return axios.post(`/teams/create-team/${topicId}`, {
            name,
            studentIds
        });
    },

    deleteTeam: (id) => {
        return axios.delete(`/teams/delete-team/${id}`);
    },
};

export default AppRepository;
