async function loadStudents() {
    const loadingMessage =
        document.getElementById("loading-message");

    const errorMessage =
        document.getElementById("error-message");

    const studentCount =
        document.getElementById("student-count");

    const tableBody =
        document.getElementById("student-table-body");

    try {
        loadingMessage.textContent = "Loading students...";
        errorMessage.textContent = "";
        tableBody.innerHTML = "";

        const response = await fetch("/api/students/");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        loadingMessage.textContent = "";
        studentCount.textContent = data.count;

        if (data.students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">No students found.</td>
                </tr>
            `;
            return;
        }

        data.students.forEach(student => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.student_name}</td>
                <td>${student.program}</td>
                <td>${student.year_level}</td>
                <td>${student.email}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        loadingMessage.textContent = "";
        errorMessage.textContent =
            `Failed to load students: ${error.message}`;
    }
}

document.addEventListener("DOMContentLoaded", loadStudents);