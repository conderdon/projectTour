import React, { useState, useEffect } from "react";
import axios from "axios";

const List = () => {
  const [tours, setTours] = useState([]); // Состояние для списка туров
  const [selectedTour, setSelectedTour] = useState(null); // Выбранный тур
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ username: '', comment: '' });

  

  useEffect(() => {
    if (selectedTour) {
      axios
        .get(`http://localhost:5001/reviews/${selectedTour.id}`)
        .then((response) => setReviews(response.data))
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [selectedTour]);

  const submitReview = () => {
    const reviewData = {
      tourId: selectedTour.id,
      username: newReview.username,
      comment: newReview.comment,
    };
    axios
    .post('http://localhost:5001/reviews', reviewData)
    .then(() => {
      setReviews([...reviews, reviewData]);
      setNewReview({ username: '', comment: '' });
    })
    .catch((error) => console.error("Error adding review:", error));
};




  // Получаем список туров
  useEffect(() => {
    axios
      .get("http://localhost:5001/tours") // Получаем данные о турах
      .then((response) => {
        const toursWithBase64 = response.data.map((tour) => {
          // Преобразуем BLOB в base64 для изображения карты, если оно есть
          if (tour.mapImage) {
            const base64Image = `data:image/jpeg;base64,${tour.mapImage}`; // Убедитесь, что здесь base64-строка
            tour.mapImage = base64Image;
          }
          return tour;
        });
        setTours(toursWithBase64); // Обновляем состояние списка туров
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        alert("Error fetching tours");
      });
  }, []);



  return (
    <div className="list">
      {tours.length > 0 ? (
        tours.map((tour, index) => (
          <div key={index} className="tourInList">
            <div>
              <img
                src={tour.photo1}
                alt={tour.name}
                onClick={() => setSelectedTour(tour)} // Выбор тура при клике на картинку
              />
              <div onClick={() => setSelectedTour(tour)}>
                <h3>{tour.name}</h3> {/* Название тура */}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No tours found</p> // Если нет туров, показываем это сообщение
      )}

      {selectedTour && (
        <dialog id="overlayMenu" open>
          <div id="infoInModal">
            <button
              id="closeBtn"
              onClick={() => {
                setSelectedTour(null); // Сбрасываем выбранный тур
              }}
            >
              X
            </button>
            <h2 id="nameInModal">{selectedTour.name}</h2>

            <div id="photoInModal">
              <img
                src={selectedTour.photo1}
                alt={selectedTour.name}
              />
              <img
                src={selectedTour.photo2}
                alt={selectedTour.name}
              />
              <img
                src={selectedTour.photo3}
                alt={selectedTour.name}
              />
            </div>

            <div className="map">
              {selectedTour.mapImage && (
                <img src={selectedTour.mapImage} alt="Map" />
              )}
            </div>

            <p id="descriptionInModal">{selectedTour.description}</p>
            <p id="daysInModal">Продолжительность: {selectedTour.days} дней</p>
            <p id="nightsInModal">Ночей: {selectedTour.nights}</p>
            <p id="priceInModal">Цена: {selectedTour.price}</p>
            <p id="typeInModal">Тип: {selectedTour.type}</p>
          </div>


          <div className="reviews">
            <h3>Отзывы:</h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review">
                  <p><b>{review.username}</b>: {review.comment}</p>
                </div>
              ))
            ) : (
              <p>Отзывов пока нет</p>
            )}

            <h4>Добавить отзыв:</h4>

            <div className="add-review">
              <input
                type="text"
                placeholder="Ваше имя"
                value={newReview.username}
                onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
              />
              <input
                placeholder="Ваш отзыв"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <button onClick={submitReview}>Отправить</button>
            </div>
          </div>





        </dialog>
      )}
    </div>
  );
};

export default List;
