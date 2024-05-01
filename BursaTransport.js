var formular = document.getElementById("contact-form");
var formularFeedback = document.getElementById("contact-form-feedback");
var startIndex = 0;
var tableCurse = document.getElementById('tabel-curse');
document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('autentificat') === 'true') {
        document.getElementById('adminButton').style.display = 'block';
    }

    getData();
});

function getData() {
    while (tableCurse.rows.length > 1) {
        tableCurse.deleteRow(1);
    }

    fetch('http://13.50.252.252:8090/cursa')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const tableBody = document.getElementById('tableBody');
            data.forEach(item => {
                const row = document.createElement('tr');
                let buttonHTML = sessionStorage.getItem('autentificat') === 'true'
                    ? `<button class="select-button" onclick="deleteRow('${item.id}')">Delete</button>`
                    : `<button class="select-button" onclick="afisareFormular('${item.locatie}','${item.data}','${item.descriere}')">Select</button>`;

                row.innerHTML = `
                    <td>${item.locatie}</td>
                    <td>${item.data}</td>
                    <td>${item.descriere}</td>
                    <td>${buttonHTML}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading the data:', error));
}

function deleteRow(id) {
    fetch(`http://13.50.252.252:8090/cursa/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            getData();
        } else {
            throw new Error('Failed to delete row');
        }
    }).catch(error => console.error('Error:', error));
}


function afisareFormular(destinatie, data, detalii) {
    if (formular.style.display == "block") {
        formular.style.display = "none"
    } else {
        formular.style.display = "block";
        document.getElementById('name').placeholder = 'NUME';
        document.getElementById('email').placeholder = 'EMAIL';
        document.getElementById('email').type = 'email';
        document.getElementById('mesaj').placeholder = 'MESAJ';
    }

    document.getElementById("mesaj").value = destinatie + '\n' + data + '\n' + detalii;
}

function afisareFormularAdaugare() {
    if (formular.style.display == "block") {
        formular.style.display = "none";
    } else {
        formular.style.display = "block";
        document.getElementById('name').placeholder = 'ÎNCĂRCARE - DESCĂRCARE';
        document.getElementById('email').placeholder = 'DATĂ';
        document.getElementById('email').type = 'text';
        document.getElementById('mesaj').placeholder = 'DESCRIERE MARFĂ';
        document.getElementById("mesaj").value = '';
    }

}

if (formularFeedback) {
    formularFeedback.addEventListener('submit', async (event) => {
        const nameFeedback = document.getElementById('nameFeedback').value;
        var rating = document.querySelector('input[name="rating"]:checked').value;
        var mesajFeedback = document.getElementById('mesajFeedback').value;

        const formData = {
            nameFeedback: nameFeedback,
            rating: rating,
            mesajFeedback: mesajFeedback,
            data: formatDate(new Date())
        };
        try {
            const response = await fetch('http://13.50.252.252:8090/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Mesaj feedback trimis");
            } else {
                throw new Error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })

}
if (formular) {
    formular.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('mesaj').value;

        if (sessionStorage.getItem('autentificat') === 'true') {
            const formData = {
                locatie: name,
                data: email,
                descriere: message,
                data: formatDate(new Date())
            };

            try {
                const response = await fetch('http://13.50.252.252:8090/cursa/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log("Cursa salvata");
                    formular.style.display = "none";
                    getData();
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            const formData = {
                name: name,
                email: email,
                message: message,
                data: formatDate(new Date())
            };
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            try {
                const response = await fetch('http://13.50.252.252:8090/send-email/curse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log("Email trimis");
                    formular.style.display = "none";
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });


}

async function getTestimonials() {
    try {
        const response = await fetch('http://13.50.252.252:8090/feedbacks');
        const data = await response.json();

        const testimonialsContainer = document.getElementById('testimonials-container');

        testimonialsContainer.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const testimonial = data[i];
            if (!testimonial) break;
            const testimonialElement = document.createElement('div');
            testimonialElement.classList.add('testimonial');
            testimonialElement.innerHTML = `
                <h3>${testimonial.nameFeedback}</h3>
                <p>${testimonial.mesajFeedback}</p>
                <p>Rating: 
                    <span class="star-rating-testimonial">
                        ${generateStars(testimonial.rating)}
                    </span>
                </p>
            `;
            testimonialsContainer.appendChild(testimonialElement);
        }

        if (data.length > 3) {
            testimonialsContainer.innerHTML += `
                <button onclick="showNextTestimonials()" class="next-button">Next</button>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function generateStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += `<label  style="--i:${i}"><i class="fas fa-star"></i></label>`;
        } else {
            starsHtml += `<label style="--i:${i}"><i class="far fa-star"></i></label>`;
        }
    }
    return starsHtml;
}
getTestimonials();


function showNextTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    startIndex += 3;
    getTestimonials(startIndex);
}

async function getTestimonials(startIndex = 0) {
    try {
        const response = await fetch('http://13.50.252.252:8090/feedbacks');
        const data = await response.json();

        const testimonialsContainer = document.getElementById('testimonials-container');

        testimonialsContainer.innerHTML = '';

        if (startIndex > 0) {
            testimonialsContainer.innerHTML += `
                <button onclick="showPreviousTestimonials()" class="previous-button">Previous</button>
            `;
        } else {
            testimonialsContainer.innerHTML += `
                <button onclick="" class="previous-button-transparent"></button>
            `;
        }

        for (let i = startIndex; i < startIndex + 3; i++) {
            const testimonial = data[i];
            if (!testimonial) break;
            const testimonialElement = document.createElement('div');
            testimonialElement.classList.add('testimonial');
            testimonialElement.innerHTML = `
                <h3>${testimonial.nameFeedback}</h3>
                <p>${testimonial.mesajFeedback}</p>
                <p>Rating: 
                    <span class="star-rating-testimonial">
                        ${generateStars(testimonial.rating)}
                    </span>
                </p>
            `;
            testimonialsContainer.appendChild(testimonialElement);
        }

        if (data.length > startIndex + 3) {
            testimonialsContainer.innerHTML += `
                <button onclick="showNextTestimonials()" class="next-button">Next</button>
            `;
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
function showPreviousTestimonials() {
    if (startIndex > 0) {
        const testimonialsContainer = document.getElementById('testimonials-container');
        startIndex -= 3;
        getTestimonials(startIndex);
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
}

function padZero(value) {
    return value < 10 ? `0${value}` : `${value}`;
}

