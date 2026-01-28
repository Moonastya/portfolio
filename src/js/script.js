const hamburger = document.querySelector('.hamburger'),
      menu = document.querySelector('.menu'),
      closeElem = document.querySelector('.menu__close'),
      menuLinks = document.querySelectorAll('.menu__link a');

hamburger.addEventListener('click', () => {
    menu.classList.add('active');
});

closeElem.addEventListener('click', () => {
    menu.classList.remove('active');
});

// Плавная прокрутка и закрытие меню при клике на ссылку
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId && targetId !== '#') {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Закрываем меню после клика
                menu.classList.remove('active');
            }
        }
    });
});

// Плавная прокрутка для кнопок в промо-секции
const promoLinks = document.querySelectorAll('.promo__link');
promoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

const counters = document.querySelectorAll('.skills__ratings-counter'),
      lines = document.querySelectorAll('.skills__ratings-line span');

counters.forEach( (item, i) => {
    lines[i].style.width = item.innerHTML;
});

// Обработка отправки формы контактов
const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(contactForm);
        const formDataObj = {
            name: formData.get('name'),
            email: formData.get('email'),
            question: formData.get('text'), // переименовываем text в question
            policy: formData.get('policy')
        };

        // Валидация
        if (!formDataObj.name || !formDataObj.email || !formDataObj.question || !formDataObj.policy) {
            showMessage('Пожалуйста, заполните все поля и подтвердите согласие с политикой конфиденциальности', 'error');
            return;
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formDataObj.email)) {
            showMessage('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }

        // Отключаем кнопку отправки
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        try {
            // Отправляем POST-запрос как multipart/form-data
            // ВАЖНО: Замените URL на адрес вашего сервера/API
            // Примеры популярных сервисов для обработки форм:
            // - Formspree: https://formspree.io/
            // - EmailJS: https://www.emailjs.com/
            // - Web3Forms: https://web3forms.com/
            // - Ваш собственный бэкенд (Node.js, PHP, Python и т.д.)
            
            const API_URL = 'https://httpbin.org/post'; // Замените на ваш URL
            
            // Создаем FormData с нужными полями
            // Сервер автоматически сгруппирует их в объект form
            const formDataToSend = new FormData();
            formDataToSend.append('email', formDataObj.email);
            formDataToSend.append('name', formDataObj.name);
            formDataToSend.append('question', formDataObj.question);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                // Не указываем Content-Type вручную - браузер сам установит правильный заголовок
                // с boundary для multipart/form-data
                body: formDataToSend
            });

            if (response.ok) {
                const result = await response.json();
                showMessage('Спасибо! Ваше сообщение успешно отправлено. Я свяжусь с вами в ближайшее время.', 'success');
                
                // Очищаем форму
                contactForm.reset();
                
                // Дополнительная очистка полей (на случай, если reset() не сработает)
                const nameInput = contactForm.querySelector('#name');
                const emailInput = contactForm.querySelector('#email');
                const textTextarea = contactForm.querySelector('#text');
                const policyCheckbox = contactForm.querySelector('#policyCheckbox');
                
                if (nameInput) nameInput.value = '';
                if (emailInput) emailInput.value = '';
                if (textTextarea) textTextarea.value = '';
                if (policyCheckbox) policyCheckbox.checked = false;
                
                // Убираем фокус с полей
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            } else {
                throw new Error('Ошибка при отправке формы');
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            showMessage('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже или свяжитесь со мной через социальные сети.', 'error');
        } finally {
            // Включаем кнопку обратно
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Функция для отображения сообщений
function showMessage(message, type) {
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `contacts__message contacts__message_${type}`;
    formMessage.style.display = 'block';
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

