let allStudents = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();

    // Attach event listeners for controls
    const searchInput = document.getElementById('searchInput');
    const programFilter = document.getElementById('programFilter');
    const clearBtn = document.getElementById('clearFiltersBtn');
    const refreshBtn = document.getElementById('refreshDataBtn');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (programFilter) programFilter.addEventListener('change', applyFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    if (refreshBtn) refreshBtn.addEventListener('click', fetchStudents);
});

function fetchStudents() {
    const loadingMsg = document.getElementById('loading-message');
    const errorMsg = document.getElementById('error-message');

    if (loadingMsg) loadingMsg.style.display = 'block';
    if (errorMsg) errorMsg.textContent = '';

    fetch('/api/students/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Safely handle plain arrays or object-wrapped API responses
            if (Array.isArray(data)) {
                allStudents = data;
            } else if (data.students && Array.isArray(data.students)) {
                allStudents = data.students;
            } else if (data.results && Array.isArray(data.results)) {
                allStudents = data.results;
            } else {
                allStudents = [];
            }

            if (loadingMsg) loadingMsg.style.display = 'none';
            applyFilters();
        })
        .catch(err => {
            console.error('Error fetching students:', err);
            if (loadingMsg) loadingMsg.style.display = 'none';
            if (errorMsg) errorMsg.textContent = 'Failed to load students: ' + err.message;
        });
}

function applyFilters() {
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const selectedProgram = (document.getElementById('programFilter')?.value || '').toLowerCase();

    const filtered = allStudents.filter(student => {
        // Fallback checks for name properties
        const fullName = (
            student.name || 
            student.student_name || 
            `${student.first_name || ''} ${student.last_name || ''}`
        ).toLowerCase();
        
        const email = (student.email || '').toLowerCase();
        const matchesSearch = fullName.includes(searchTerm) || email.includes(searchTerm);
        
        const matchesProgram = selectedProgram === '' || (student.program || '').toLowerCase() === selectedProgram;

        return matchesSearch && matchesProgram;
    });

    renderTable(filtered);
}

function renderTable(students) {
    const tbody = document.getElementById('student-table-body');
    const resultCount = document.getElementById('resultCount');
    const studentCount = document.getElementById('student-count');

    // Update counter displays
    if (resultCount) resultCount.textContent = `Total Results: ${students.length}`;
    if (studentCount) studentCount.textContent = students.length;

    if (!tbody) return;
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 10px; color: red;">No matching records found</td></tr>';
        return;
    }

    students.forEach(s => {
        const displayName = s.name || s.student_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'N/A';
        const row = `<tr>
            <td>${s.id}</td>
            <td>${displayName}</td>
            <td>${s.program || 'N/A'}</td>
            <td>${s.year_level || 'N/A'}</td>
            <td>${s.email || 'N/A'}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const programFilter = document.getElementById('programFilter');

    if (searchInput) searchInput.value = '';
    if (programFilter) programFilter.value = '';

    applyFilters();
}

