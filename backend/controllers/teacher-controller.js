const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({ 
            name, 
            email, 
            password: hashedPass, 
            role, 
            school, 
            teachSubject, 
            teachSclass,
            teachSubjects: [] // Initialize empty array for multiple subjects
        });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await teacher.save();
            await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("teachSubjects.subject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSubjects.subject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("teachSubjects.subject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const addTeacherSubject = async (req, res) => {
    const { teacherId, subjectId, semester } = req.body;
    
    console.log('=== Add Teacher Subject Request ===');
    console.log('Teacher ID:', teacherId);
    console.log('Subject ID:', subjectId);
    console.log('Semester:', semester);
    
    try {
        const teacher = await Teacher.findById(teacherId);
        
        if (!teacher) {
            console.log('ERROR: Teacher not found');
            return res.send({ message: 'Teacher not found' });
        }

        console.log('Teacher found:', teacher.name);
        console.log('Current teachSubjects:', teacher.teachSubjects);

        // Check if subject already exists in the same semester
        const existingSubject = teacher.teachSubjects.find(
            ts => ts.subject.toString() === subjectId && ts.semester === semester
        );

        if (existingSubject) {
            console.log('ERROR: Subject already assigned for this semester');
            return res.send({ message: 'Subject already assigned for this semester' });
        }

        teacher.teachSubjects.push({ subject: subjectId, semester: semester });
        await teacher.save();
        
        console.log('Subject added successfully');
        console.log('Updated teachSubjects:', teacher.teachSubjects);

        // Update subject with teacher reference
        await Subject.findByIdAndUpdate(subjectId, { teacher: teacherId });

        // Return populated teacher
        const updatedTeacher = await Teacher.findById(teacherId)
            .populate('teachSubjects.subject', 'subName sessions');
        
        console.log('Returning updated teacher');
        res.send(updatedTeacher);
    } catch (error) {
        console.log('ERROR in addTeacherSubject:', error);
        res.status(500).json(error);
    }
};

const removeTeacherSubject = async (req, res) => {
    const { teacherId, subjectId, semester } = req.body;
    try {
        const teacher = await Teacher.findById(teacherId);
        
        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        teacher.teachSubjects = teacher.teachSubjects.filter(
            ts => !(ts.subject.toString() === subjectId && ts.semester === semester)
        );
        await teacher.save();

        // Remove teacher reference from subject only if not teaching it in any semester
        const stillTeaching = teacher.teachSubjects.some(
            ts => ts.subject.toString() === subjectId
        );
        
        if (!stillTeaching) {
            await Subject.findByIdAndUpdate(subjectId, { $unset: { teacher: 1 } });
        }

        res.send(teacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

const updateTeacher = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        let result = await Teacher.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacher,
    updateTeacherSubject,
    addTeacherSubject,
    removeTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};