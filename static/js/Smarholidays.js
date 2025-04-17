document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.image-grid');
    const images = grid.querySelectorAll('img');

    images.forEach(img => {
        img.style.gridRowStart = img.dataset.row;
        img.style.gridColumnStart = img.dataset.col;
        img.style.gridRowEnd = `span ${img.dataset.height}`;
        img.style.gridColumnEnd = `span ${img.dataset.width}`;
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const onlineBtn = document.querySelector(".online-btn");
  const offlineBtn = document.querySelector(".offline-btn");
  const onlinePricingSection = document.getElementById("pricing-section");
  const offlinePricingSection = document.getElementById("offline-pricing-section");

  function showSection(sectionToShow, sectionToHide) {
      sectionToShow.style.display = "block";
      sectionToHide.style.display = "none";
  }

  onlineBtn.addEventListener("click", function () {
      showSection(onlinePricingSection, offlinePricingSection);
  });

  offlineBtn.addEventListener("click", function () {
      showSection(offlinePricingSection, onlinePricingSection);
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const signupButton = document.querySelector(".signup-button");
    const messageDiv = document.getElementById("message");
    const dataDisplayDiv = document.getElementById("data-display");

    signupButton.addEventListener("click", function () {
        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name || !phone) {
            if (messageDiv) {
                messageDiv.textContent = "Пожалуйста, заполните все поля!";
                messageDiv.style.color = "red";
            }
            return;
        }

        const formData = { name, phone };

        fetch("/submit_form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (messageDiv) {
                messageDiv.textContent = data.message;
                messageDiv.style.color = "green";
            }
            nameInput.value = "";
            phoneInput.value = "";

            fetch("/get_data")
                .then(response => response.json())
                .then(displayData)
                .catch(error => {
                    console.error("Ошибка получения данных:", error);
                    if (dataDisplayDiv) {
                        dataDisplayDiv.textContent = "Ошибка при получении данных.";
                    }
                });
        })
        .catch(error => {
            console.error("Ошибка отправки:", error);
            if (messageDiv) {
                messageDiv.textContent = "Произошла ошибка при отправке.";
                messageDiv.style.color = "red";
            }
        });
    });

    function displayData(data) {
        if (!dataDisplayDiv) return;
        dataDisplayDiv.innerHTML = "";

        if (Array.isArray(data) && data.length > 0) {
            dataDisplayDiv.innerHTML = "<h3>Полученные данные:</h3>";
            const ul = document.createElement("ul");
            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `Имя: ${item.name}, Телефон: ${item.phone}`;
                ul.appendChild(li);
            });
            dataDisplayDiv.appendChild(ul);
        } else {
            dataDisplayDiv.textContent = "Нет данных.";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("signupModal");
    const closeModalBtn = document.getElementById("closeModal");
    const signupButtons = document.querySelectorAll(".signup-btn");
    const submitFormBtn = document.getElementById("submitForm");
    const mainSignupButton = document.querySelector(".signup-button"); // Кнопка в основной форме


    let selectedShift = ""; // Переменная для хранения выбранной смены

    // Открытие модального окна
    signupButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Получаем название смены из карточки смены
            selectedShift = this.closest(".shift-card").querySelector(".shift-header h2").innerText;
            document.getElementById("selectedShift").innerText = `Вы записываетесь на: ${selectedShift}`;
            modal.style.display = "flex";
        });
    });

    // Закрытие модального окна
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Закрытие при клике вне модального окна
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Отправка данных на сервер Flask (из модального окна)
    submitFormBtn.addEventListener("click", function () {
        const userName = document.getElementById("userName").value.trim();
        const userPhone = document.getElementById("userPhone").value.trim();
        const userEmail = document.getElementById("userEmail").value.trim();

        if (!userName || !userPhone || !userEmail) {
            alert("Заполните все поля!");
            return;
        }

        // Отправляем данные, включая выбранную смену и email
        fetch("/submit_form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: userName, phone: userPhone, shift: selectedShift, email: userEmail })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message.includes("успешно")) {
                modal.style.display = "none";
                document.getElementById("userName").value = "";
                document.getElementById("userPhone").value = "";
                document.getElementById("userEmail").value = "";
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("Ошибка при отправке данных!");
        });
    });


    // Код для основной формы
    if (mainSignupButton) {
        mainSignupButton.addEventListener("click", function () {
            const nameInput = document.getElementById("name");
            const phoneInput = document.getElementById("phone");
            const emailInput = document.getElementById("email");

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();

            if (!name || !phone || !email) {
                alert("Пожалуйста, заполните все поля!");
                return;
            }

            const formData = {
                name: name,
                phone: phone,
                email: email,
                shift: "" // Добавляем shift со значением ""
            };

            fetch("/submit_form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.message.includes("успешно")) {
                    nameInput.value = "";
                    phoneInput.value = "";
                    emailInput.value = "";
                }
            })
            .catch(error => {
                console.error("Ошибка:", error);
                alert("Ошибка при отправке данных!");
            });
        });
    }
});

