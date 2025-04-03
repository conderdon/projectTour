import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";

  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
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

  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="searchman">
      <h2>Результаты поиска: "{searchQuery}"</h2>

      <div className="searched">
        {isLoading ? (
          <p>Загрузка фильмов...</p>
        ) : filteredTours.length > 0 ? (
          <div className="tourInSearch">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="searchContainer"
              onClick={() => setSelectedTour(tour)}
              >
                <img
                  src={tour.photo1}
                  alt={tour.name}
                  onClick={() => setSelectedTour(tour)}
                />
                <>
                <h3
                onClick={() => setSelectedTour(tour)} 
                >{tour.name}</h3></>
              </div>
            ))}
          </div>
        ) : (
          <p>Фильмы по запросу не найдены.</p>
        )}

{selectedTour && (
        <dialog id="overlayMenu" open>
          <div id="infoInModal">
            <button
              id="closeBtn"
              onClick={() => {
                setSelectedTour(null);
              }}
            >
              X
            </button>
            <h2 id="nameInModal">{selectedTour.name}</h2>
            {selectedTour.photo1 && <img src={selectedTour.photo1} alt={selectedTour.name} />}
                {selectedTour.photo2 && <img src={selectedTour.photo2} alt={selectedTour.name} />}
                {selectedTour.photo3 && <img src={selectedTour.photo3} alt={selectedTour.name} />}
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

export default Search;