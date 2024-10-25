const createNoteForm = document.getElementById('createNote');

createNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(createNoteForm);

    fetch('http://localhost:3000/note/create', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
})