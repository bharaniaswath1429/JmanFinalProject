const fs = require('fs');
const { format } = require('date-fns');
const { parse } = require('json2csv');

// Define possible values
const courseTitles = ['Python', 'React', 'Nodejs', 'Java', 'QA', 'Data Science', 'PowerBI', 'Cloud', 'Docker', 'Typescript', 'Javascript', 'AFD', 'DTB'];
const designations = ['Software Engineer', 'Principle Architect', 'Platform Engineer', 'Data Engineer', 'QA Engineer', 'DevOps Engineer', 'Data Scientist', 'Data Analyst'];
const questionsTemplate = {
  'Software Engineer': [
  {
    question: 'What is a closure in JavaScript?',
    answers: ['A function within another function', 'A method in Java', 'A loop', 'An event listener'],
    correctAnswer: 'A function within another function',
  },
  {
    question: 'What does the `map()` function do in Python?',
    answers: ['It maps URLs', 'It iterates over lists', 'It filters data', 'It creates new objects'],
    correctAnswer: 'It iterates over lists',
  },
  {
    question: 'In Java, what does the `final` keyword mean?',
    answers: ['A constant variable', 'A loop that can\'t be broken', 'An immutable class', 'A method that can be overridden'],
    correctAnswer: 'A constant variable',
  },
  {
    question: 'What is the purpose of `async` and `await` in JavaScript?',
    answers: ['To handle synchronous code', 'To handle asynchronous code', 'To define loops', 'To block threads'],
    correctAnswer: 'To handle asynchronous code',
  },
  {
    question: 'Which of the following is true about RESTful APIs?',
    answers: ['It uses HTTP methods', 'It requires SOAP', 'It mandates XML responses', 'It is only used with GET requests'],
    correctAnswer: 'It uses HTTP methods',
  },
],
  'QA Engineer': [
  {
    question: 'What is boundary value testing?',
    answers: ['Testing the maximum values', 'Testing at the boundary between partitions', 'Testing only valid inputs', 'Testing with random inputs'],
    correctAnswer: 'Testing at the boundary between partitions',
  },
  {
    question: 'Which tool is used for performance testing?',
    answers: ['Jira', 'JMeter', 'Confluence', 'Git'],
    correctAnswer: 'JMeter',
  },
  {
    question: 'What is the difference between regression testing and retesting?',
    answers: ['Retesting verifies new functionality, regression testing checks existing functionality', 'Regression is for performance, retesting is for correctness', 'Regression testing checks new features', 'Retesting is done after bug fixes'],
    correctAnswer: 'Retesting is done after bug fixes',
  },
  {
    question: 'Which of the following is a non-functional testing type?',
    answers: ['Performance testing', 'Unit testing', 'Integration testing', 'System testing'],
    correctAnswer: 'Performance testing',
  },
  {
    question: 'What is the main objective of test automation?',
    answers: ['Reduce manual effort', 'Increase bugs', 'Reduce testing time only', 'Test for security flaws'],
    correctAnswer: 'Reduce manual effort',
  },
],
'DevOps Engineer': [
  {
    question: 'What is Docker used for?',
    answers: ['Managing virtual machines', 'Running containers', 'Building applications', 'Storing databases'],
    correctAnswer: 'Running containers',
  },
  {
    question: 'Which tool is commonly used for CI/CD pipelines?',
    answers: ['Jenkins', 'Jira', 'Jupyter', 'JVM'],
    correctAnswer: 'Jenkins',
  },
  {
    question: 'What is the primary benefit of Infrastructure as Code (IaC)?',
    answers: ['Automatic deployments', 'Version control of infrastructure', 'Database management', 'Monitoring logs'],
    correctAnswer: 'Version control of infrastructure',
  },
  {
    question: 'What does `kubectl` do in a Kubernetes environment?',
    answers: ['Manage Kubernetes clusters', 'Manage Docker containers', 'Deploy databases', 'Run CI/CD pipelines'],
    correctAnswer: 'Manage Kubernetes clusters',
  },
  {
    question: 'What is the purpose of load balancing?',
    answers: ['Distribute traffic across servers', 'Increase latency', 'Reduce security risks', 'Manage file uploads'],
    correctAnswer: 'Distribute traffic across servers',
  },
],
'Data Scientist': [
  {
    question: 'Which of the following is a supervised learning algorithm?',
    answers: ['K-Means', 'Linear Regression', 'DBSCAN', 'PCA'],
    correctAnswer: 'Linear Regression',
  },
  {
    question: 'What is the primary use of a confusion matrix?',
    answers: ['To visualize classification results', 'To plot data', 'To detect overfitting', 'To reduce dimensionality'],
    correctAnswer: 'To visualize classification results',
  },
  {
    question: 'Which of the following techniques is used to handle missing data?',
    answers: ['PCA', 'Imputation', 'Clustering', 'Gradient Descent'],
    correctAnswer: 'Imputation',
  },
  {
    question: 'What is the purpose of cross-validation?',
    answers: ['To test the model on training data', 'To prevent overfitting', 'To test only the outliers', 'To simplify the dataset'],
    correctAnswer: 'To prevent overfitting',
  },
  {
    question: 'Which of the following is used to evaluate a regression model?',
    answers: ['Mean Absolute Error', 'Precision', 'Recall', 'Confusion Matrix'],
    correctAnswer: 'Mean Absolute Error',
  },
],
'Data Analyst': [
  {
    question: 'What is the primary function of PowerBI?',
    answers: ['Data visualization', 'Web development', 'Creating databases', 'CI/CD automation'],
    correctAnswer: 'Data visualization',
  },
  {
    question: 'Which of the following is a measure of central tendency?',
    answers: ['Mean', 'Variance', 'Standard deviation', 'Correlation'],
    correctAnswer: 'Mean',
  },
  {
    question: 'In SQL, which clause is used to filter records?',
    answers: ['WHERE', 'ORDER BY', 'GROUP BY', 'JOIN'],
    correctAnswer: 'WHERE',
  },
  {
    question: 'What is a pivot table used for?',
    answers: ['Summarizing data', 'Filtering data', 'Sorting data', 'Joining tables'],
    correctAnswer: 'Summarizing data',
  },
  {
    question: 'Which type of graph is best for showing proportions?',
    answers: ['Pie chart', 'Line graph', 'Scatter plot', 'Bar chart'],
    correctAnswer: 'Pie chart',
  },
],
'Platform Engineer': [
  {
    question: 'Which cloud service model provides virtualized computing resources over the internet?',
    answers: ['IaaS', 'PaaS', 'SaaS', 'CaaS'],
    correctAnswer: 'IaaS',
  },
  {
    question: 'Which of the following is a cloud computing platform?',
    answers: ['AWS', 'Jenkins', 'Git', 'Linux'],
    correctAnswer: 'AWS',
  },
  {
    question: 'Which technology is used to virtualize hardware resources?',
    answers: ['Hypervisor', 'Router', 'Docker', 'Proxy'],
    correctAnswer: 'Hypervisor',
  },
  {
    question: 'What is a common use case for a Content Delivery Network (CDN)?',
    answers: ['Distribute website content geographically', 'Deploy applications', 'Manage databases', 'Monitor server health'],
    correctAnswer: 'Distribute website content geographically',
  },
  {
    question: 'What does horizontal scaling refer to in cloud computing?',
    answers: ['Adding more servers', 'Increasing RAM on a single server', 'Optimizing code', 'Upgrading database size'],
    correctAnswer: 'Adding more servers',
  },
],
};

// Function to generate random course data
const generateCourses = (numCourses) => {
  const courses = [];

  for (let i = 0; i < numCourses; i++) {
    const title = courseTitles[Math.floor(Math.random() * courseTitles.length)];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    
    // Get relevant questions for the designation
    const questions = questionsTemplate[designation] || [
      {
        question: 'Generic question 1?',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correctAnswer: 'Answer 1',
      },
    ];

    // Calculate duration (e.g., 10 minutes per question)
    const duration = questions.length;

    // Dynamic start and end dates
    const startCourseDate = format(new Date(), 'yyyy-MM-dd');
    const courseExpireDate = format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd');

    // Generate timestamps
    const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    // Create the course object
    courses.push({
      title,
      duration,
      designation,
      description: `This is a course on ${title} for ${designation}.`,
      questions: JSON.stringify(questions), // Store questions as a JSON string
      startCourseDate,
      courseExpireDate
    });
  }

  return courses;
};

// Generate the courses
const courses = generateCourses(50);

// Convert to CSV format
const fields = ['title', 'duration', 'designation', 'description', 'questions', 'startCourseDate', 'courseExpireDate'];
const csv = parse(courses, { fields });

// Write to CSV file
fs.writeFileSync('courses_with_questions.csv', csv);

console.log('CSV file has been generated successfully.');