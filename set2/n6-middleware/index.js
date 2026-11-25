/**
 * Name: Liezelle Mangunay
 * Section: IV-BSIT C
 * Activity: N6 - Middleware and API Testing
 * Date: November 25, 2026
 */

const http = require('http');

const PORT = 8000;

// In-memory data store for students
let students = [
  { id: 1, name: 'Liezelle Mangunay', course: 'BSIT', year: 4 },
  { id: 2, name: 'Sofia Reyes', course: 'BSIT', year: 4 },
  { id: 3, name: 'Patrick Guiang', course: 'BSIT', year: 4 }
];

// Middleware 1: Custom logger middleware (logs HTTP method, URL, and date/time)
function loggerMiddleware(req, res, next) {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
}

// Middleware 2: Sets Content-Type: application/json for all API responses
function jsonHeaderMiddleware(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next(); // Pass control to the route handler
}

// Helper function to execute middlewares in sequence before the route handler
function runMiddlewares(req, res, middlewares, finalHandler) {
  let index = 0;

  function next() {
    if (index < middlewares.length) {
      const currentMiddleware = middlewares[index++];
      currentMiddleware(req, res, next);
    } else {
      finalHandler(req, res);
    }
  }

  next();
}

// Helper function to parse incoming JSON request bodies
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

// Main route handler for /api/students endpoints
async function handleApiRoutes(req, res) {
  const { method, url } = req;

  // 1. GET /api/students - Return all students
  if (method === 'GET' && url === '/api/students') {
    res.statusCode = 200;
    return res.end(JSON.stringify(students, null, 2));
  }

  // Match /api/students/:id
  const idMatch = url.match(/^\/api\/students\/(\d+)$/);

  if (idMatch) {
    const id = parseInt(idMatch[1], 10);
    const studentIndex = students.findIndex((s) => s.id === id);

    // 2. GET /api/students/:id - Return one student or 404
    if (method === 'GET') {
      if (studentIndex === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: `Student with ID ${id} not found.` }, null, 2));
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(students[studentIndex], null, 2));
    }

    // 4. PUT /api/students/:id - Update an existing student
    if (method === 'PUT') {
      if (studentIndex === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: `Student with ID ${id} not found.` }, null, 2));
      }
      try {
        const body = await getRequestBody(req);
        students[studentIndex] = {
          ...students[studentIndex],
          name: body.name ?? students[studentIndex].name,
          course: body.course ?? students[studentIndex].course,
          year: body.year ?? students[studentIndex].year
        };
        res.statusCode = 200;
        return res.end(JSON.stringify(students[studentIndex], null, 2));
      } catch (err) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: err.message }, null, 2));
      }
    }

    // 5. DELETE /api/students/:id - Remove an existing student
    if (method === 'DELETE') {
      if (studentIndex === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: `Student with ID ${id} not found.` }, null, 2));
      }
      const deletedStudent = students.splice(studentIndex, 1)[0];
      res.statusCode = 200;
      return res.end(
        JSON.stringify(
          { message: `Student with ID ${id} deleted successfully.`, deleted: deletedStudent },
          null,
          2
        )
      );
    }
  }

  // 3. POST /api/students - Add a new student (201 Created)
  if (method === 'POST' && url === '/api/students') {
    try {
      const body = await getRequestBody(req);
      if (!body.name || !body.course || !body.year) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: 'Fields name, course, and year are required.' }, null, 2));
      }
      const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
      const newStudent = {
        id: newId,
        name: body.name,
        course: body.course,
        year: Number(body.year)
      };
      students.push(newStudent);
      res.statusCode = 201;
      return res.end(JSON.stringify(newStudent, null, 2));
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: err.message }, null, 2));
    }
  }

  // Fallback 404 for unknown endpoints
  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Endpoint not found.' }, null, 2));
}

// Create server and pass every request through the middleware pipeline
const server = http.createServer((req, res) => {
  runMiddlewares(req, res, [loggerMiddleware, jsonHeaderMiddleware], handleApiRoutes);
});

server.listen(PORT, () => {
  console.log(`N6 Students API with Middleware running at http://localhost:${PORT}`);
});