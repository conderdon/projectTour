import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tourId, setTourId] = useState('');
  const [message, setMessage] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/tours')
      .then((response) => {
        setTours(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке туров:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      name,
      phone,
      email,
      tourId,
      peopleCount,
      message,
      totalCost,
    };
    axios.post('http://localhost:5001/requests', requestData)
      .then((response) => {
        console.log('Заявка отправлена:', response);
        alert('Заявка отправлена');
      })
      .catch((error) => {
        console.error('Ошибка при отправке заявки:', error);
      });
  };

  const handleTourChange = (event) => {
    const selectedTour = tours.find((tour) => tour.id === parseInt(event.target.value));
    if (selectedTour) {
      setTourId(selectedTour.id);
      setTotalCost(selectedTour.price * peopleCount);
    }
  };

  const handlePeopleCountChange = (event) => {
    const count = parseInt(event.target.value);
    setPeopleCount(count);
    const selectedTour = tours.find((tour) => tour.id === parseInt(tourId));
    if (selectedTour) {
      setTotalCost(selectedTour.price * count);
    }
  };

  return (
    <div className="requestForm">
      <form onSubmit={handleSubmit}>
        <label>
          Имя:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Номер телефона:
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Выберите тур:
          <select value={tourId} onChange={handleTourChange} required>
            <option value="" disabled>Выберите тур</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.name} - {tour.price} $ за человека
              </option>
            ))}
          </select>
        </label>
        <label>
          Количество человек:
          <input
            type="number"
            value={peopleCount}
            onChange={handlePeopleCountChange}
            min="1"
            required
          />
        </label>
        <label>
          Общая стоимость:
          <input type="text" value={totalCost} readOnly />
        </label>
        <label>
          Сообщение:
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </label>
        <button type="submit">Отправить заявку</button>
      </form>
    </div>
  );
};

export default RequestForm;

