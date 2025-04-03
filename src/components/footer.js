// Footer.js
import React from "react";
import Wa from "../whatsapp.png";
import Ins from "../instagram.png";


const Footer = () => {
 



  return (
    <div className="footer">
      <div className="logos">
      <a aria-label="Chat on WhatsApp" href="https://wa.me/+996502950850">
      <img width={65} alt="Chat on WhatsApp" src={Wa} />
      </a>
      <a aria-label="Chat on instagram" href="https://www.instagram.com/dosy_04/">
      <img width={65} alt="Chat on instagram" src={Ins} />
      </a>
      </div>

      
      <ul>
        <li>Наш адрес: г. Бишкек, ул. Ленина 1</li>
        <li>Телефон: +996 502 950 850</li>
        <li>Email: 5u5QX@example.com</li>

      </ul>



    </div>
  );
};

export default Footer;

