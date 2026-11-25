/*
 * Full Name: Liezelle Mangunay
 * Section: IV-BSIT C
 * Activity Code: ELEC 3 - N5 (REST-style API)
 * Date: November 25, 2026
 */

const http = require('http');

const PORT = 8000;

// In-memory array starting with 3 sample student records
let students = [
  { id: 1, name: 'Liezelle Mangunay', course: 'BSIT', year: 4 },
  { id: 2, name: 'Sophia Reyes', course: 'BSIT', year: 3 },
  { id: 3, name: 'Patrick Guiang', course: 'BSCS', year: 2 }
];

// Helper function to send consistent JSON responses
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// Helper function to read and parse JSON request body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // 1. GET /api/students - Return all students
  if (url === '/api/students' && method === 'GET') {
    return sendJson(res, 200, students);
  }

  // 3. POST /api/students - Add a new student from JSON body
  if (url === '/api/students' && method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      if (!body.name || !body.course || !body.year) {
        return sendJson(res, 400, { message: 'Name, course, and year are required.' });
      }

      const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
      const newStudent = {
        id: nextId,
        name: body.name,
        course: body.course,
        year: Number(body.year)
      };

      students.push(newStudent);
      return sendJson(res, 201, newStudent);
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  // Match routes with :id parameter (/api/students/:id)
  const idMatch = url.match(/^\/api\/students\/(\d+)$/);

  if (idMatch) {
    const id = parseInt(idMatch[1], 10);
    const studentIndex = students.findIndex((s) => s.id === id);

    // 2. GET /api/students/:id - Return one student or 404
    if (method === 'GET') {
      if (studentIndex === -1) {
        return sendJson(res, 404, { message: `Student with ID ${id} not found.` });
      }
      return sendJson(res, 200, students[studentIndex]);
    }

    // 4. PUT /api/students/:id - Update an existing student
    if (method === 'PUT') {
      if (studentIndex === -1) {
        return sendJson(res, 404, { message: `Student with ID ${id} not found.` });
      }
      try {
        const body = await parseRequestBody(req);
        students[studentIndex] = {
          ...students[studentIndex],
          name: body.name ?? students[studentIndex].name,
          course: body.course ?? students[studentIndex].course,
          year: body.year !== undefined ? Number(body.year) : students[studentIndex].year
        };
        return sendJson(res, 200, students[studentIndex]);
      } catch (error) {
        return sendJson(res, 400, { message: error.message });
      }
    }

    // 5. DELETE /api/students/:id - Remove a student
    if (method === 'DELETE') {
      if (studentIndex === -1) {
        return sendJson(res, 404, { message: `Student with ID ${id} not found.` });
      }
      const deletedStudent = students.splice(studentIndex, 1)[0];
      return sendJson(res, 200, {
        message: `Student with ID ${id} deleted successfully.`,
        deleted: deletedStudent
      });
    }
  }

  // Fallback for unknown routes
  return sendJson(res, 404, { message: 'Endpoint not found.' });
});

server.listen(PORT, () => {
  console.log(`N5 Students REST API running at http://localhost:${PORT}`);
});