const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Admin = require('./models/adminSchema');
const Sclass = require('./models/sclassSchema');
const Subject = require('./models/subjectSchema');
const Teacher = require('./models/teacherSchema');
const Student = require('./models/studentSchema');
const Notice = require('./models/noticeSchema');
const FeeStructure = require('./models/feeStructureSchema');
const FeePayment = require('./models/feePaymentSchema');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function seedData() {
    try {
        console.log('🌱 Starting to seed database...\n');

        // Find the admin with the specified email
        const admin = await Admin.findOne({ email: 'shankarsanti143@gmail.com' });
        
        if (!admin) {
            console.log('❌ Admin not found! Please register first with:');
            console.log('   Email: shankarsanti143@gmail.com');
            console.log('   Password: 4143');
            process.exit(1);
        }

        const schoolId = admin._id;
        const schoolName = admin.schoolName;

        console.log(`✓ Found admin: ${admin.name}`);
        console.log(`✓ School: ${schoolName}\n`);

        // Clear existing data for this school
        console.log('🧹 Clearing existing data...');
        await Sclass.deleteMany({ school: schoolId });
        await Subject.deleteMany({ school: schoolId });
        await Teacher.deleteMany({ school: schoolId });
        await Student.deleteMany({ school: schoolId });
        await Notice.deleteMany({ school: schoolId });
        await FeeStructure.deleteMany({ school: schoolId });
        await FeePayment.deleteMany({ school: schoolId });
        console.log('✓ Cleared old data\n');

        // Create Classes
        console.log('📚 Creating classes...');
        const classes = [
            { sclassName: 'SSLC', school: schoolId },
            { sclassName: 'BCA 1st Year', school: schoolId },
            { sclassName: 'BCA 2nd Year', school: schoolId },
            { sclassName: 'BCA 3rd Year', school: schoolId },
            { sclassName: 'MCA 1st Year', school: schoolId },
            { sclassName: 'MCA 2nd Year', school: schoolId },
            { sclassName: 'B.Tech 1st Year', school: schoolId },
            { sclassName: 'B.Tech 2nd Year', school: schoolId },
        ];
        const createdClasses = await Sclass.insertMany(classes);
        console.log(`✓ Created ${createdClasses.length} classes\n`);

        // Create Subjects for each class
        console.log('📖 Creating subjects...');
        const subjects = [];
        
        // SSLC Subjects
        const sslcSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Kannada'];
        for (const subName of sslcSubjects) {
            subjects.push({
                subName: subName,
                subCode: `SSLC-${subName.substring(0, 3).toUpperCase()}`,
                sessions: 40,
                sclassName: createdClasses[0]._id,
                school: schoolId
            });
        }
        
        // BCA Subjects
        const bcaSubjects = {
            '1st Year': ['Programming in C', 'Digital Electronics', 'Mathematics', 'Computer Fundamentals', 'English'],
            '2nd Year': ['Data Structures', 'Database Management', 'Java Programming', 'Web Technologies', 'Operating Systems'],
            '3rd Year': ['Software Engineering', 'Computer Networks', 'Python Programming', 'Cloud Computing', 'Project Work']
        };
        
        for (let i = 1; i <= 3; i++) {
            const yearSubjects = bcaSubjects[`${i}${i === 1 ? 'st' : i === 2 ? 'nd' : 'rd'} Year`];
            for (const subName of yearSubjects) {
                subjects.push({
                    subName: subName,
                    subCode: `BCA${i}-${subName.substring(0, 3).toUpperCase()}`,
                    sessions: 45,
                    sclassName: createdClasses[i]._id,
                    school: schoolId
                });
            }
        }
        
        // MCA Subjects
        const mcaSubjects = {
            '1st Year': ['Advanced Java', 'Machine Learning', 'Big Data Analytics', 'Mobile Computing', 'Research Methodology'],
            '2nd Year': ['Artificial Intelligence', 'Cyber Security', 'IoT', 'Blockchain', 'Major Project']
        };
        
        for (let i = 1; i <= 2; i++) {
            const yearSubjects = mcaSubjects[`${i}${i === 1 ? 'st' : 'nd'} Year`];
            for (const subName of yearSubjects) {
                subjects.push({
                    subName: subName,
                    subCode: `MCA${i}-${subName.substring(0, 3).toUpperCase()}`,
                    sessions: 45,
                    sclassName: createdClasses[i + 3]._id,
                    school: schoolId
                });
            }
        }
        
        // B.Tech Subjects
        const btechSubjects = {
            '1st Year': ['Engineering Mathematics', 'Physics', 'Chemistry', 'Engineering Graphics', 'Programming'],
            '2nd Year': ['Data Structures', 'Computer Architecture', 'Discrete Mathematics', 'Digital Logic', 'DBMS']
        };
        
        for (let i = 1; i <= 2; i++) {
            const yearSubjects = btechSubjects[`${i}${i === 1 ? 'st' : 'nd'} Year`];
            for (const subName of yearSubjects) {
                subjects.push({
                    subName: subName,
                    subCode: `BTECH${i}-${subName.substring(0, 3).toUpperCase()}`,
                    sessions: 50,
                    sclassName: createdClasses[i + 5]._id,
                    school: schoolId
                });
            }
        }
        
        const createdSubjects = await Subject.insertMany(subjects);
        console.log(`✓ Created ${createdSubjects.length} subjects\n`);

        // Create Teachers
        console.log('👨‍🏫 Creating teachers...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('teacher123', salt);
        
        const teachers = [
            {
                name: 'Dr. Rajesh Kumar',
                email: 'rajesh.kumar@college.com',
                password: hashedPassword,
                role: 'Teacher',
                school: schoolId,
                teachSubject: createdSubjects[0]._id, // SSLC Mathematics
                teachSubjects: [
                    { subject: createdSubjects[0]._id, semester: 'Sem 1' },
                    { subject: createdSubjects[1]._id, semester: 'Sem 2' }
                ],
                teachSclass: createdClasses[0]._id
            },
            {
                name: 'Prof. Priya Sharma',
                email: 'priya.sharma@college.com',
                password: hashedPassword,
                role: 'Teacher',
                school: schoolId,
                teachSubject: createdSubjects[5]._id, // BCA Programming in C
                teachSubjects: [
                    { subject: createdSubjects[5]._id, semester: 'Sem 1' },
                    { subject: createdSubjects[6]._id, semester: 'Sem 2' }
                ],
                teachSclass: createdClasses[1]._id
            },
            {
                name: 'Dr. Amit Patel',
                email: 'amit.patel@college.com',
                password: hashedPassword,
                role: 'Teacher',
                school: schoolId,
                teachSubject: createdSubjects[10]._id, // BCA 2nd Year Data Structures
                teachSubjects: [
                    { subject: createdSubjects[10]._id, semester: 'Sem 1' },
                    { subject: createdSubjects[11]._id, semester: 'Sem 2' }
                ],
                teachSclass: createdClasses[2]._id
            },
            {
                name: 'Prof. Sunita Verma',
                email: 'sunita.verma@college.com',
                password: hashedPassword,
                role: 'Teacher',
                school: schoolId,
                teachSubject: createdSubjects[15]._id, // BCA 3rd Year Software Engineering
                teachSubjects: [
                    { subject: createdSubjects[15]._id, semester: 'Sem 1' }
                ],
                teachSclass: createdClasses[3]._id
            },
            {
                name: 'Dr. Vikram Singh',
                email: 'vikram.singh@college.com',
                password: hashedPassword,
                role: 'Teacher',
                school: schoolId,
                teachSubject: createdSubjects[20]._id, // MCA Advanced Java
                teachSubjects: [
                    { subject: createdSubjects[20]._id, semester: 'Sem 1' },
                    { subject: createdSubjects[21]._id, semester: 'Sem 2' }
                ],
                teachSclass: createdClasses[4]._id
            },
            {
                name: 'Prof. Anita Desai',
                email: 'anita.desai@college.com',
                password: hashedPassword,
                role: 'Teacher',
                school: schoolId,
                teachSubject: createdSubjects[30]._id, // B.Tech Engineering Mathematics
                teachSubjects: [
                    { subject: createdSubjects[30]._id, semester: 'Sem 1' }
                ],
                teachSclass: createdClasses[6]._id
            }
        ];
        const createdTeachers = await Teacher.insertMany(teachers);
        console.log(`✓ Created ${createdTeachers.length} teachers\n`);

        // Create Students
        console.log('👨‍🎓 Creating students...');
        const studentPassword = await bcrypt.hash('student123', salt);
        
        const students = [];
        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Ananya', 'Diya', 'Isha', 'Priya', 'Riya', 'Rohan', 'Karan'];
        const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Verma', 'Gupta', 'Reddy', 'Rao', 'Nair', 'Joshi', 'Mehta', 'Shah'];
        
        let rollNumber = 1;
        // Add students to each class
        for (let classIndex = 0; classIndex < createdClasses.length; classIndex++) {
            const studentsPerClass = classIndex === 0 ? 15 : 12; // More students in SSLC
            for (let i = 0; i < studentsPerClass; i++) {
                const firstName = firstNames[i % firstNames.length];
                const lastName = lastNames[i % lastNames.length];
                students.push({
                    name: `${firstName} ${lastName}`,
                    rollNum: rollNumber++,
                    password: studentPassword,
                    sclassName: createdClasses[classIndex]._id,
                    school: schoolId,
                    role: 'Student',
                    examResult: [],
                    attendance: []
                });
            }
        }
        const createdStudents = await Student.insertMany(students);
        console.log(`✓ Created ${createdStudents.length} students\n`);

        // Create Notices
        console.log('📢 Creating notices...');
        const notices = [
            {
                title: 'Welcome to New Academic Year',
                details: 'We welcome all students and faculty to the new academic year. Classes will begin from next Monday.',
                date: new Date(),
                school: schoolId
            },
            {
                title: 'Semester Examination Schedule',
                details: 'Semester examinations will commence from 1st of next month. Time table will be shared with students soon.',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                school: schoolId
            },
            {
                title: 'Technical Fest Announcement',
                details: 'Annual technical fest "TechnoVision 2026" will be held next month. Students are requested to register for events.',
                date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                school: schoolId
            },
            {
                title: 'Industry Expert Lecture Series',
                details: 'Industry experts will be conducting guest lectures on emerging technologies. All students are encouraged to attend.',
                date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                school: schoolId
            },
            {
                title: 'Placement Drive',
                details: 'Campus placement drive for final year students will begin next week. Students should update their resumes.',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                school: schoolId
            }
        ];
        const createdNotices = await Notice.insertMany(notices);
        console.log(`✓ Created ${createdNotices.length} notices\n`);

        // Create Fee Structures
        console.log('💰 Creating fee structures...');
        const feeStructures = [
            {
                feeType: 'Tuition Fee',
                amount: 25000,
                class: createdClasses[1]._id, // BCA 1st Year
                school: schoolId,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                feeType: 'Exam Fee',
                amount: 3000,
                class: createdClasses[1]._id,
                school: schoolId,
                dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            },
            {
                feeType: 'Library Fee',
                amount: 2000,
                class: createdClasses[1]._id,
                school: schoolId,
                dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            },
            {
                feeType: 'Lab Fee',
                amount: 5000,
                class: createdClasses[1]._id,
                school: schoolId,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                feeType: 'Sports Fee',
                amount: 1500,
                class: createdClasses[1]._id,
                school: schoolId,
                dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            }
        ];
        const createdFeeStructures = await FeeStructure.insertMany(feeStructures);
        console.log(`✓ Created ${createdFeeStructures.length} fee structures\n`);

        // Create some sample fee payments
        console.log('💳 Creating sample fee payments...');
        const payments = [];
        // Add payments for first 8 BCA students
        for (let i = 15; i < 23; i++) { // BCA students start after SSLC students
            payments.push({
                student: createdStudents[i]._id,
                feeStructure: createdFeeStructures[0]._id,
                amount: 25000,
                paymentDate: new Date(),
                paymentMethod: 'Online',
                school: schoolId
            });
        }
        const createdPayments = await FeePayment.insertMany(payments);
        console.log(`✓ Created ${createdPayments.length} fee payments\n`);

        console.log('✅ Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Programs: ${createdClasses.length} (SSLC, BCA, MCA, B.Tech)`);
        console.log(`   - Subjects: ${createdSubjects.length}`);
        console.log(`   - Teachers: ${createdTeachers.length}`);
        console.log(`   - Students: ${createdStudents.length}`);
        console.log(`   - Notices: ${createdNotices.length}`);
        console.log(`   - Fee Structures: ${createdFeeStructures.length}`);
        console.log(`   - Fee Payments: ${createdPayments.length}`);
        console.log('\n🔐 Login Credentials:');
        console.log('   Admin:');
        console.log('   - Email: shankarsanti143@gmail.com');
        console.log('   - Password: 4143');
        console.log('\n   Teacher (any):');
        console.log('   - Email: rajesh.kumar@college.com (or any teacher email)');
        console.log('   - Password: teacher123');
        console.log('\n   Student (any):');
        console.log('   - Roll Number: 1 to ' + createdStudents.length);
        console.log('   - Name: Check in admin panel');
        console.log('   - Password: student123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedData();
