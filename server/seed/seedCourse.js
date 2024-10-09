const fs = require('fs');
const csv = require('csv-parser');
const { Course } = require('../models'); // Adjust the path to your models folder

const seedCourses = async () => {
  const results = [];

  // Read CSV file and parse data
  fs.createReadStream('seed/courses_with_questions.csv') // Adjust the path to your CSV
    .pipe(csv())
    .on('data', (row) => {
      // Push each row into results array
      results.push(row);
    })
    .on('end', async () => {
      try {
        // Seed each course to the database
        for (const courseData of results) {
          try {
            // Parse JSON data for 'questions' field (since it's stored as a string in CSV)
            //console.log(courseData)
            courseData.questions = JSON.parse(courseData.questions);
            
          } catch (jsonError) {
            console.error('Failed to parse questions JSON:', jsonError);
            continue; // Skip this record if JSON parsing fails
          }

          // Create the course in the database
          await Course.create({
            title: courseData.title,
            duration: courseData.duration,
            designation: courseData.designation,
            description: courseData.description,
            questions: courseData.questions, // Now properly parsed JSON
            startCourseDate: courseData.startCourseDate,
            courseExpireDate: courseData.courseExpireDate,
          });
        }
        console.log('Courses have been successfully seeded.');
      } catch (error) {
        console.error('Failed to seed courses:', error);
      }
    });
};

// Call the seed function
seedCourses();
