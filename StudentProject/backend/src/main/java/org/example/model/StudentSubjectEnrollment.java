//package org.example.model;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.Id;
//import jakarta.persistence.ManyToOne;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import lombok.ToString;
//import org.example.model.JoinedSubject;
//import org.example.model.Semester;
//import org.example.model.Student;
//import org.example.model.Subject;
//
//@Getter
//@Setter
//@ToString
//@NoArgsConstructor
//@Entity
//public class StudentSubjectEnrollment {
//    @Id
//    private String id;
//
//    @ManyToOne
//    private Semester semester;
//
//    @ManyToOne
//    private Student student;
//
//    @ManyToOne
//    private Subject subject;
//
//    private Boolean valid;
//
//    @Column(length = 4000)
//    private String invalidNote;
//
//
//    private Short numEnrollments;
//
//    private String groupName;
//
//    private Long groupId;
//
//
//    @ManyToOne
//    private JoinedSubject joinedSubject;
//
//    private String professorId;
//
//    private String professors;
//
//    private String assistants;
//
//    public StudentSubjectEnrollment(Semester semester, Student student, Subject subject, Short numEnrollments) {
//        this.id = String.format("%s-%s-%s", semester.getCode(), student.getIndex(), subject.getId());
//        this.semester = semester;
//        this.student = student;
//        this.subject = subject;
//        this.numEnrollments = numEnrollments;
//    }
//
//
//}
