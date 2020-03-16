import '../scss/main.scss';
import reviewTemplateRender from '../views/blocks/review.hbs';
import reviewTemplatePopup from '../views/blocks/popup.hbs';
import feedback from '../views/blocks/feedback.hbs';
import Map from './modules/map';

var store = JSON.parse(localStorage.getItem('marks')) || [];
console.log(store);
ymaps.ready(function () {

    const renderHandler = function (e, review) {
        e.preventDefault();
        console.log(review.coords);
        openPopup(review);
    }

    var apiMap = new Map("map", {
        center: [55.76, 37.64],
        zoom: 7
    });

    store.forEach(placemark => {
        apiMap.createPlacemark(placemark.coords, {
            balloonContent: reviewTemplateRender(placemark)
        }, {
            type: 'click',
            handler: function (e) {
                renderHandler(e, placemark);
            }
        })
    });

    apiMap.on('click', async function (e) {
        const review = {};
        const position = e.get('position');
        review.x = position[0];
        review.y = position[1];

        review.coords = e.get('coords');
        review.address = await this.geocoder(review.coords);
        console.log(position);
        openPopup.call(this, review);
    });

    function openPopup(review) {
        console.log(review);
        const popup = document.querySelector('.popup');
        popup.innerHTML = reviewTemplatePopup(review);
        popup.style.display = 'flex';
        popup.style.position = 'absolute';
        popup.style.top = review.y + 'px';
        popup.style.left = review.x + 'px';

        closePopup(popup);

        addFeedback.call(this, popup, review);
    }

    function closePopup(popup) {
        const closeButton = document.querySelector('.header__close');

        closeButton.addEventListener('click', () => {
            popup.style.display = 'none';
            popup.innerHTML = '';
        });
    }

    function addFeedback(popup, review) {
        const formInputAll = document.querySelectorAll('.form__input');
        const feedbackList = document.querySelector('.feedback__list');
        const feedbackItem = document.createElement('li');
        const addButton = document.querySelector('.form__submit');
        feedbackItem.classList.add('feedback__item');

        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            for (let input of formInputAll) {
                if (input.value) {
                    review[input.getAttribute('name')] = input.value;
                    input.value = '';
                }
            }
            const date = new Date().toDateString();
            review['date'] = date;

            const feedbackItem = document.createElement('li');
            feedbackItem.classList.add('feedback__item');

            feedbackItem.innerHTML = feedback(review);
            feedbackList.append(feedbackItem);

            store.push(review);
            localStorage.setItem('marks', JSON.stringify(store));

            this.createPlacemark(review.coords, {
                balloonContent: reviewTemplateRender(review)
            }, {
                type: 'click',
                handler: function (e) {
                    renderHandler(e, review);
                }
            });
        });
    }
});
