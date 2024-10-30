import React, { useEffect, useState } from "react";
import Footer from "../../Components/footer/footer";
import Header from "../../Components/header/header";
import "./AvailableBus.css";
import Cards from "../../Components/cardBus/BusTrips.json";
import CardBus from "../../Components/cardBus/cardBus";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Label from "@mui/material/FormLabel";
import { useDispatch } from "react-redux";

// import { addRoute, deleteRoute } from "../../store/slice/busSlice";
import { addRoute, deleteRoute, updateRoute } from "../../store/slice/busSlice";
import { useSelector } from "react-redux";

const ModalWindow = ({ onClose, record }) => {
  return (
    <div className="modal">
      <div className="modal-content-bus-info">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <CardBus {...record} />
      </div>
    </div>
  );
};

function AvailableBus() {
  const [formData, setFormData] = useState({
    startCity: "",
    finishCity: "",
    startTime: "",
    finishTime: "",
    price: "",
    platformNumber: "",
    carrier: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [cards, setCards] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const BusRoutes = useSelector((state) => state.BusRoute);

  useEffect(() => {
    setCards(BusRoutes);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedCards = [...cards];
      updatedCards[editIndex] = formData;
      setCards(updatedCards);
      dispatch(
        updateRoute({
          id: formData.id,
          startCity: formData.startCity,
          finishCity: formData.finishCity,
          startTime: formData.startTime,
          finishTime: formData.finishTime,
          price: formData.price,
          platformNumber: formData.platformNumber,
          monday: formData.monday,
          tuesday: formData.tuesday,
          wednesday: formData.wednesday,
          thursday: formData.thursday,
          friday: formData.friday,
          saturday: formData.saturday,
          sunday: formData.sunday,
        })
      );
      setEditIndex(null);
    } else {
      setCards([...cards, formData]);

      dispatch(
        addRoute({
          id: BusRoutes[BusRoutes.length - 1].id + 1,
          startCity: formData.startCity,
          finishCity: formData.finishCity,
          startTime: formData.startTime,
          finishTime: formData.finishTime,
          price: formData.price,
          platformNumber: formData.platformNumber,
          monday: formData.monday,
          tuesday: formData.tuesday,
          wednesday: formData.wednesday,
          thursday: formData.thursday,
          friday: formData.friday,
          saturday: formData.saturday,
          sunday: formData.sunday,
        })
      );
    }
    console.log(BusRoutes);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      startCity: "",
      finishCity: "",
      startTime: "",
      finishTime: "",
      price: "",
      platformNumber: "",
      carrier: "",
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };

  const filteredRoutes = cards.filter(
    (card) =>
      card.startCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.finishCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (index) => {
    const routeToEdit = cards[index];
    setEditIndex(index);
    setFormData({
      ...routeToEdit,
      // Добавьте здесь явное присваивание для каждого дня
      monday: routeToEdit.monday,
      tuesday: routeToEdit.tuesday,
      wednesday: routeToEdit.wednesday,
      thursday: routeToEdit.thursday,
      friday: routeToEdit.friday,
      saturday: routeToEdit.saturday,
      sunday: routeToEdit.sunday,
    });
  };

  const handleDelete = (index) => {
    const routeToDelete = cards[index]; // Получаем маршрут, который нужно удалить
    dispatch(deleteRoute({ id: routeToDelete.id })); // Используем правильный id
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
    console.log(BusRoutes);
  };

  const handleChangeDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      [day]: !prev[day], // Переключаем значение дня
    }));
  };

  const handleDisplayAlert = (route) => {
    setSelectedRecord(route);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const options = ["Чаусы-Могилев", "Чаусы-Могилев 2", "Чаусы-Могилев 3"];

  return (
    <div className="App">
      <Header />

      <div className="DivDisplayFlex AvailableBus-class">
        <div>
          <h2>Таблица маршрутов</h2>
          <input
            className="Search-input"
            type="text"
            placeholder="Поиск по таблице..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="TableContainer">
            <table className="TableClass">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("startCity")}
                    style={{ cursor: "pointer" }}
                  >
                    Город отправления
                  </th>
                  <th
                    onClick={() => handleSort("finishCity")}
                    style={{ cursor: "pointer" }}
                  >
                    Город прибытия
                  </th>
                  <th
                    onClick={() => handleSort("startTime")}
                    style={{ cursor: "pointer" }}
                  >
                    Время отправления
                  </th>
                  <th
                    onClick={() => handleSort("finishTime")}
                    style={{ cursor: "pointer" }}
                  >
                    Время прибытия
                  </th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedRoutes.map((route, index) => (
                  <tr key={index}>
                    <td>{route.startCity}</td>
                    <td>{route.finishCity}</td>
                    <td>{route.startTime}</td>
                    <td>{route.finishTime}</td>
                    <td>
                      <button onClick={() => handleEdit(index)}>
                        Изменить
                      </button>
                      <button onClick={() => handleDelete(index)}>
                        Удалить
                      </button>
                      <button onClick={() => handleDisplayAlert(route)}>
                        Информация
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form className="FormAddRoute" onSubmit={handleSubmit}>
          <h2>Добавить поездку</h2>

          <Autocomplete
            options={options}
            value={`${formData.startCity}-${formData.finishCity}`}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                startCity: newValue.split("-")[0],
                finishCity: newValue.split("-")[1],
              });
            }}
            renderInput={(params) => <TextField {...params} label="Маршрут" />}
          />

          <div className="DivDisplayFlex">
            <Label>Время отправления:</Label>
            <Input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="DivDisplayFlex">
            <Label>Время прибытия:</Label>
            <Input
              type="time"
              name="finishTime"
              value={formData.finishTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="DivDisplayFlex">
            <Label>
              Цена:
              <Input
                sx={{ maxWidth: 70 }}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              {" p."}
            </Label>
          </div>

          <div className="DivDisplayFlex">
            <Label>Номер платформы:</Label>
            <Input
              sx={{ maxWidth: 60 }}
              type="number"
              name="platformNumber"
              value={formData.platformNumber}
              onChange={handleChange}
              required
            />
          </div>

          <Autocomplete
            options={options}
            value={formData.carrier || "-"}
            name="carrier"
            onChange={(event, newValue) =>
              setFormData({ ...formData, carrier: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Перевозчик" />
            )}
          />

          <div className="table-container-weekdays">
            <table className="WeekdaysTable">
              <thead>
                <tr>
                  <th>Пн</th>
                  <th>Вт</th>
                  <th>Ср</th>
                  <th>Чт</th>
                  <th>Пт</th>
                  <th>Сб</th>
                  <th>Вс</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <td key={day}>
                      <input
                        type="checkbox"
                        checked={formData[day]}
                        onChange={() => handleChangeDay(day)}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <Button type="submit">
            {editIndex !== null ? "Сохранить изменения" : "Добавить поездку"}
          </Button>
        </form>
      </div>

      {showModal && selectedRecord && (
        <ModalWindow onClose={closeModal} record={selectedRecord} />
      )}

      <Footer />
    </div>
  );
}

export default AvailableBus;
