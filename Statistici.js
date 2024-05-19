var obiect = sessionStorage.getItem('autentificat');
var formular = document.getElementById("contact-form");
var statistici = document.getElementById("statistici");
var ratingInput = document.getElementById("ratingInput");
var emailInput = document.getElementById("emailInput");
var tableFeedback = document.getElementById('feedbackTable');
var tableCurse = document.getElementById('emailTable');
var ratingDiv = document.getElementById('rating');
var medie = 0;
var nrRating = 0;

if (obiect !== null) {
    formular.style.display = "none";
    statistici.style.display = "block";
}

fetch('https://bursa-transport-server.onrender.com/emails')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(emailRequest => {
            const row = tableCurse.insertRow();
            row.insertCell(0).textContent = emailRequest.name;
            row.insertCell(1).textContent = emailRequest.email;
            row.insertCell(2).textContent = emailRequest.message;
            row.insertCell(3).textContent = emailRequest.data;
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


fetch('https://bursa-transport-server.onrender.com/feedbacks')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(emailRequest => {
            const row = tableFeedback.insertRow();
            row.insertCell(0).textContent = emailRequest.nameFeedback;
            row.insertCell(1).textContent = emailRequest.rating;
            row.insertCell(2).textContent = emailRequest.mesajFeedback;
            row.insertCell(3).textContent = emailRequest.data;
            medie += parseFloat(emailRequest.rating);
            nrRating++;
        });


        medie /= nrRating;
        ratingDiv.innerHTML = "Evaluare medie:" + medie.toFixed(1) + `<span class="star-rating">
        <label for="rate-1" style="--i:1"><i class="fa-solid fa-star"></i></label>
        <input type="radio" name="rating" id="rate-1" value="1" checked>
    </span>`;

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


formular.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const parola = document.getElementById('parola').value;

    const formData = {
        username: username,
        parola: parola
    };

    try {
        const response = await fetch('https://bursa-transport-server.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log("Utilizator logat");
            formular.style.display = "none";
            statistici.style.display = "block";

            sessionStorage.setItem("autentificat", true);
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function searchByEmailCurse() {
    while (tableCurse.rows.length > 1) {
        tableCurse.deleteRow(1);
    }
    var valoareInput = emailInput.value;
    if (valoareInput === '') {

        fetch('https://bursa-transport-server.onrender.com/emails')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.forEach(emailRequest => {
                    const row = tableCurse.insertRow();
                    row.insertCell(0).textContent = emailRequest.name;
                    row.insertCell(1).textContent = emailRequest.email;
                    row.insertCell(2).textContent = emailRequest.message;
                    row.insertCell(3).textContent = emailRequest.data;
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    fetch(`https://bursa-transport-server.onrender.com/emails/${valoareInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(emailRequest => {
                const row = tableCurse.insertRow();
                row.insertCell(0).textContent = emailRequest.name;
                row.insertCell(1).textContent = emailRequest.email;
                row.insertCell(2).textContent = emailRequest.message;
                row.insertCell(3).textContent = emailRequest.data;
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}

function allData() {
    while (tableCurse.rows.length > 1) {
        tableCurse.deleteRow(1);
    }
    fetch('https://bursa-transport-server.onrender.com/emails')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(emailRequest => {
                const row = tableCurse.insertRow();
                row.insertCell(0).textContent = emailRequest.name;
                row.insertCell(1).textContent = emailRequest.email;
                row.insertCell(2).textContent = emailRequest.message;
                row.insertCell(3).textContent = emailRequest.data;
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function searchByNameRating() {
    while (tableFeedback.rows.length > 1) {
        tableFeedback.deleteRow(1);
    }
    var valoareInput = ratingInput.value;
    if (valoareInput === '') {

        fetch('https://bursa-transport-server.onrender.com/feedbacks')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.forEach(emailRequest => {
                    const row = tableFeedback.insertRow();
                    row.insertCell(0).textContent = emailRequest.nameFeedback;
                    row.insertCell(1).textContent = emailRequest.rating;
                    row.insertCell(2).textContent = emailRequest.mesajFeedback;
                    row.insertCell(3).textContent = emailRequest.data;
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    fetch(`https://bursa-transport-server.onrender.com/feedbacks/${valoareInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(emailRequest => {
                const row = tableFeedback.insertRow();
                row.insertCell(0).textContent = emailRequest.nameFeedback;
                row.insertCell(1).textContent = emailRequest.rating;
                row.insertCell(2).textContent = emailRequest.mesajFeedback;
                row.insertCell(3).textContent = emailRequest.data;
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}

function allDataFeedback() {
    while (tableFeedback.rows.length > 1) {
        tableFeedback.deleteRow(1);
    }
    fetch('https://bursa-transport-server.onrender.com/feedbacks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(emailRequest => {
                const row = tableFeedback.insertRow();
                row.insertCell(0).textContent = emailRequest.nameFeedback;
                row.insertCell(1).textContent = emailRequest.rating;
                row.insertCell(2).textContent = emailRequest.mesajFeedback;
                row.insertCell(3).textContent = emailRequest.data;
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

fetch('https://bursa-transport-server.onrender.com/graph-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        const dataFromBackend = data;

        // Extrageți numele lunilor și valorile din datele primite
        const months = Object.keys(dataFromBackend);
        const values = Object.values(dataFromBackend);

        // Creează un nou grafic utilizând Chart.js
        const ctx = document.getElementById('objectCreationChart').getContext('2d');
        const objectCreationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Numărul de curse solicitate',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

