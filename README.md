# Learning Management System (LMS)

This project implements a Learning Management System (LMS) using Next.js and Firebase. It provides a platform for administrators, teachers, and students to manage and access educational content efficiently.

## Features

**Administrator:**

* User management (create, update, delete, bulk upload via Excel)
* Role assignment (student, teacher, admin)
* Course category management
* Group creation, management, and member assignment (bulk upload via Excel)

**Teacher:**

* Course creation, updating, and deletion
* Module creation and management within courses
* Content management (files, URLs, assignments, syllabus) within courses and modules
* Student enrollment and unenrollment (individual, bulk via Excel, group-based)
* Assignment creation, updating, and deletion
* Grading and feedback for assignments
* Manual grade entry
* View student performance and course analytics
* Add other teachers to a course

**Student:**

* View enrolled courses and course content
* Access course modules and materials
* View course participants
* View and submit assignments
* View grades and feedback for submitted assignments

## Technologies Used

* **Frontend:** Next.js, Tailwind CSS, TypeScript
* **Backend:** Next.js
* **Database:** Firebase Firestore
* **Storage:** Firebase Storage
* **Version Control:** Git/GitHub

## Installation

1. Clone the repository: `git clone https://github.com/PriyanshChaudhari/lms.git`
2. Navigate to the project directory: `cd lms`
3. Install dependencies: `npm install`
4. Set up Firebase:
    * Create a Firebase project in the Firebase console.
    * Add a web app to your Firebase project.
    * Copy the Firebase configuration object into a `.env.local` file at the root of the project.
5. Run the development server: `npm run dev`

## Project Structure

* `src/app/`: Next.js app directory containing pages and components.
* `src/app/api/`: directory containing apis.
* `src/components/`: Reusable React components.
* `src/lib/`: Utility functions, API calls, and Firebase interactions.

## Database Schema

See the [LMS Database Design](https://firebasestorage.googleapis.com/v0/b/minor-project-01-5a5b7.appspot.com/o/docs%2FLMS_Database_Design.docx.pdf?alt=media&token=bbd737af-76ff-44cc-b6fd-4f032ed07ba2) for a 
document detailed description of the database schema, including tables like Users, Courses, Enrollments, Modules, Content, Assignments, Submissions, and Grades.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Screenshots

See the [LMS Screenshots](https://firebasestorage.googleapis.com/v0/b/minor-project-01-5a5b7.appspot.com/o/docs%2FLMS_Output_Screenshots.pdf?alt=media&token=e8f4830d-2758-43ce-adf1-a53543e86f79) document for screenshots of the application.

##  Academic Project Information

This project was developed as a minor project for the FSBEIV(2024-25) program in Computer Science and Engineering at The Maharaja Sayajirao University of Baroda.
