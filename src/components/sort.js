import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Sort = () => {
  const { type } = useParams(); // Получаем параметр type из URL
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ username: '', comment: '' });

  // Загрузка туров
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5001/tours")
      .then((response) => {
        const toursWithBase64 = response.data.map((tour) => {
          if (tour.mapImage && !tour.mapImage.startsWith("data:image/jpeg;base64,")) {
            tour.mapImage = `data:image/jpeg;base64,${tour.mapImage}`;
          }
          return tour;
        });
        setTours(toursWithBase64);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        alert("Error fetching tours");
        setIsLoading(false);
      });
  }, []);

  // Фильтрация туров по типу
  const filteredTours = type === "Все типы"
    ? tours
    : tours.filter((tour) => tour.type.toLowerCase().trim() === type.toLowerCase().trim());

  // Загрузка отзывов
  useEffect(() => {
    if (selectedTour) {
      axios
        .get(`http://localhost:5001/reviews/${selectedTour.id}`)
        .then((response) => setReviews(response.data))
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [selectedTour]);

  // Добавление отзыва
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

  return (
    <div className="sorman">
      <h2>Туры типа: {type}</h2>

      <div className="sorted">
        {isLoading ? (
          <p>Загрузка туров...</p>
        ) : filteredTours.length > 0 ? (
          <div className="tourInSort">
            {filteredTours.map((tour) => (
              <div key={tour.id || tour.name} className="tourContainer" onClick={() => setSelectedTour(tour)}>
                {tour.photo1 && (
                  <img
                    src={tour.photo1}
                    alt={tour.name}
                    onClick={() => setSelectedTour(tour)}
                  />
                )}
                <h3 onClick={() => setSelectedTour(tour)}>{tour.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>Туры данного типа не найдены.</p>
        )}

        {selectedTour && (
          <dialog id="overlayMenu" open>
            <div id="infoInModal">
              <button
                id="closeBtn"
                onClick={() => setSelectedTour(null)}
              >
                X
              </button>
              <h2 id="nameInModal">{selectedTour.name}</h2>
              <div id="photoInModal">
                {selectedTour.photo1 && <img src={selectedTour.photo1} alt={selectedTour.name} />}
                {selectedTour.photo2 && <img src={selectedTour.photo2} alt={selectedTour.name} />}
                {selectedTour.photo3 && <img src={selectedTour.photo3} alt={selectedTour.name} />}
              </div>
              {selectedTour.mapImage && (
                <div className="map">
                  <img src={selectedTour.mapImage} alt="Map" />
                </div>
              )}
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
    </div>
  );
};

export default Sort;
