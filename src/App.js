import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <img src="/icon_v2.png" alt="Weather_icon" className="App-logo" />
                    <Typography variant="h5">Weather App</Typography>
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:day" element={<DetailedForecast />} />
                </Routes>
                <footer className="App-footer">
                    <Typography variant="body2"></Typography>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function Home() {
    const [pogodaKrakow, setPogodaKrakow] = useState(null);

    useEffect(() => {
        fetchWeatherData('Krakow', setPogodaKrakow);
    }, []);

    const fetchWeatherData = async (location, setData) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=50.0614&longitude=19.9366&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=Europe%2FBerlin`
            );
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych pogodowych');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="content">
            <Typography variant="h4">Dzisiaj w Krakowie</Typography>
            {pogodaKrakow && (
                <div className="today-forecast">
                    <div className="forecast-item">
                        <Typography>
                            Wschód: <b>{pogodaKrakow.daily.sunrise[0].split('T')[1]}</b>
                        </Typography>
                    </div>
                    <div className="forecast-item">
                        <Typography>
                            Zachód: <b>{pogodaKrakow.daily.sunset[0].split('T')[1]}</b>
                        </Typography>
                    </div>
                    <div className="forecast-item">
                        <Typography>
                            Temperatura maksymalna: <b>{pogodaKrakow.daily.temperature_2m_max[0]}°C</b>
                        </Typography>
                    </div>
                    <div className="forecast-item">
                        <Typography>
                            Temperatura minimalna: <b>{pogodaKrakow.daily.temperature_2m_min[0]}°C</b>
                        </Typography>
                    </div>
                    <div className="forecast-item">
                        <Typography>
                            Szansa opadów: <b>{pogodaKrakow.daily.precipitation_probability_max[0]}%</b>
                        </Typography>
                    </div>
                </div>
            )}
            <div>
                <Button variant="contained" component={Link} to="/dzis">
                    Szczegółowa prognoza
                </Button>
            </div>
            <hr width="70%" align="center"></hr>

            <Typography variant="h4">Prognoza na kolejne dni</Typography>

            {pogodaKrakow && (
                <div className="multi-day-forecast">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Wschód słońca</TableCell>
                                    <TableCell>Zachód słońca</TableCell>
                                    <TableCell>Temp. max (°C)</TableCell>
                                    <TableCell>Temp. min (°C)</TableCell>
                                    <TableCell>Szansa opadów (%)</TableCell>
                                    <TableCell>Szczegóły</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pogodaKrakow.daily.temperature_2m_max.map((maxTemp, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{pogodaKrakow.daily.time[index]}</TableCell>
                                        <TableCell>{pogodaKrakow.daily.sunrise[index].split('T')[1]}</TableCell>
                                        <TableCell>{pogodaKrakow.daily.sunset[index].split('T')[1]}</TableCell>
                                        <TableCell>{maxTemp}°C</TableCell>
                                        <TableCell>{pogodaKrakow.daily.temperature_2m_min[index]}°C</TableCell>
                                        <TableCell>{pogodaKrakow.daily.precipitation_probability_max[index]}%</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                style={{ margin: '20px' }}
                                                component={Link}
                                                to={`/${pogodaKrakow.daily.time[index]}`}
                                            >
                                                Szczegółowa prognoza
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
}

function DetailedForecast() {
  const { day } = useParams();
  const [pogodaKrakow, setPogodaKrakow] = useState(null);

  useEffect(() => {
      fetchWeatherData('Krakow', setPogodaKrakow);
  }, []);

  const fetchWeatherData = async (location, setData) => {
      try {
          const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=50.060567&longitude=19.937694&hourly=temperature_2m,precipitation_probability,precipitation,surface_pressure,cloudcover`
          );
          if (!response.ok) {
              throw new Error('Nie udało się pobrać danych pogodowych');
          }
          const data = await response.json();
          setData(data);
      } catch (error) {
          console.error(error);
      }
  };

  return (
      <div className="content">
          <Typography variant="h4" className="Detail-title">
              Szczegółowa prognoza na {day}
          </Typography>
          {pogodaKrakow && (
              <TableContainer>
                  <Table>
                      <TableHead>
                          <TableRow>
                              <TableCell>Godzina</TableCell>
                              <TableCell>Temperatura</TableCell>
                              <TableCell>Opady</TableCell>
                              <TableCell>Szansa opadów</TableCell>
                              <TableCell>Zachmurzenie</TableCell>
                              <TableCell>Ciśnienie</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {pogodaKrakow.hourly.time.map((time, index) => {
                              const date = time.split('T')[0];
                              if (date === day) {
                                  return (
                                      <TableRow key={index}>
                                          <TableCell>{time.split('T')[1]}</TableCell>
                                          <TableCell>
                                              <b>{pogodaKrakow.hourly.temperature_2m[index]}</b> °C
                                          </TableCell>
                                          <TableCell>
                                              <b>{pogodaKrakow.hourly.precipitation[index]}</b> mm
                                          </TableCell>
                                          <TableCell>
                                              <b>{pogodaKrakow.hourly.precipitation_probability[index]}</b> %
                                          </TableCell>
                                          <TableCell>
                                              <b>{pogodaKrakow.hourly.cloudcover[index]}</b> %
                                          </TableCell>
                                          <TableCell>
                                              <b>{pogodaKrakow.hourly.surface_pressure[index]}</b> hPa
                                          </TableCell>
                                      </TableRow>
                                  );
                              } else {
                                  return null;
                              }
                          })}
                      </TableBody>
                  </Table>
              </TableContainer>
          )}
      </div>
  );
}

export default App;
