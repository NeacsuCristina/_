const form = document.getElementById('contact-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const formData = {
        name: name,
        email: email,
        message: message,
        data: formatDate(new Date())
    };
    console.log(formData);
    try {
        const response = await fetch('http://13.50.252.252:8090/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log("Email trimis");
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';

        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function formatDate(date) {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
}

function padZero(value) {
    return value < 10 ? `0${value}` : `${value}`;
}