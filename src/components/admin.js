import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  // Состояния для туров
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState('');
  const [nights, setNights] = useState('');
  const [price, setPrice] = useState('');
  const [photo1, setPhoto1] = useState('');
  const [photo2, setPhoto2] = useState('');
  const [photo3, setPhoto3] = useState('');
  const [mapImage, setMapImage] = useState(null);
  const [type, setType] = useState('');
  const [tours, setTours] = useState([]);
    const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);










   // Загрузка туров
   useEffect(() => {
    axios.get('http://localhost:5001/tours')
      .then((response) => {
        setTours(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        alert("Error fetching tours");
      });

    // Загрузка заявок
    axios.get('http://localhost:5001/requests')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        alert("Error fetching requests");
      });

  
  }, []);






  // Удаление отзыва
  const deleteReview = (id) => {
    axios.delete(`http://localhost:5001/reviews/${id}`)
      .then(() => {
        setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
        alert('Review deleted');
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
        alert("Error deleting review");
      });
  };




  // Добавление тура
  const addTour = () => {
    const formData = new FormData();
    if (name.trim()) formData.append('name', name);
    if (description.trim()) formData.append('description', description);
    if (days) formData.append('days', parseInt(days, 10));
    if (nights) formData.append('nights', parseInt(nights, 10));
    if (price) formData.append('price', parseFloat(price));
    if (photo1.trim()) formData.append('photo1', photo1);
    if (photo2.trim()) formData.append('photo2', photo2);
    if (photo3.trim()) formData.append('photo3', photo3);
    if (type.trim()) formData.append('type', type);
    if (mapImage) formData.append('mapImage', mapImage);

    if (!name || !description || !days || !nights || !price || !type) {
      alert("Все обязательные поля должны быть заполнены");
      return;
    }

    axios.post('http://localhost:5001/tours', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        alert('Tour added!');
        setName('');
        setDescription('');
        setDays('');
        setNights('');
        setPrice('');
        setPhoto1('');
        setPhoto2('');
        setPhoto3('');
        setType('');
        setMapImage(null);
      })
      .catch((error) => {
        console.error("Error adding tour:", error);
        alert("Error adding tour");
      });
  };

  // Удаление тура
  const deleteTour = (id) => {
    axios.delete(`http://localhost:5001/tours/${id}`)
      .then(() => {
        setTours(prevTours => prevTours.filter(tour => tour.id !== id));
        alert('Tour deleted');
      })
      .catch((error) => {
        console.error("Error deleting tour:", error);
        alert("Error deleting tour");
      });
  };






// Удаление заявки
const deleteRequest = (id) => {
  axios.delete(`http://localhost:5001/requests/${id}`)
    .then(() => {
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      alert('Request deleted');
    })
    .catch((error) => {
      console.error("Error deleting request:", error);
      alert("Error deleting request");
    });
};




  return (
    <div className="admin">
      <h1 className="vac">Admin Panel</h1>
      
      {/* Форма для добавления туров */}
      <div className="adminPannel">
        <input type="text" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Дни" value={days} onChange={(e) => setDays(e.target.value)} />
        <input type="number" placeholder="Ночи" value={nights} onChange={(e) => setNights(e.target.value)} />
        <input type="text" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="Фото 1 (URL)" value={photo1} onChange={(e) => setPhoto1(e.target.value)} />
        <input type="text" placeholder="Фото 2 (URL)" value={photo2} onChange={(e) => setPhoto2(e.target.value)} />
        <input type="text" placeholder="Фото 3 (URL)" value={photo3} onChange={(e) => setPhoto3(e.target.value)} />
        <select 
          id='typeInput'
          onChange={(e) => setType(e.target.value)}
          placeholder="Тип тура"
        >
          <option value="">Выберите тип тура</option> 
          <option value="Пешие">Пешие</option>
          <option value="Машинные">Машинные</option>
          <option value="Конные">Конные</option>
          <option value="Культурные">Культурные</option>
          <option value="Вело">Вело</option>
        </select>        
        <input 
          type="file" 
          onChange={(e) => setMapImage(e.target.files[0])} 
          accept="image/*"
        />
        <button onClick={addTour}>Добавить тур</button>
      </div>

      {/* Список туров */}
      <div id="listOnAdmin">
        <h2>Список туров</h2>
        {tours.length > 0 ? (
          tours.map((tour, index) => (
            <div key={index} className="tour">
              <h3>{tour.name}</h3>
              <button onClick={() => deleteTour(tour.id)}>Удалить</button>
            </div>
          ))
        ) : (
          <p>Туры не найдены</p>
        )}
      </div>

      {/* Список заявок */}
     <div id="requestsList">
        <h2>Список заявок</h2>
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <div key={index} className="request">
              <p><strong>Имя:</strong> {request.name}</p>
              <p><strong>Телефон:</strong> {request.phone}</p>
              <p><strong>Email:</strong> {request.email}</p>
              <p><strong>Тур:</strong> {request.tour_name}</p>
              <p><strong>Количество человек:</strong> {request.people_count}</p>
              <p><strong>Сообщение:</strong> {request.message}</p>
              <p><strong>Общая стоимость:</strong> {request.total_cost} $</p>
              <button onClick={() => deleteRequest(request.id)}>Удалить заявку</button>
            </div>
          ))
        ) : (
          <p>Заявки не найдены</p>
        )}
      </div>
      
    </div>
  );
};

export default Admin;
