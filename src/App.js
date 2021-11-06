import React from "react";
import "./App.css";

import umuttepe from "./images/umuttepe.jpg";
import loading from "./images/loading.gif";

import ReactHlsPlayer from "react-hls-player";

function MyCustomComponent(props) {
  return (
    <ReactHlsPlayer
      className="filter brightness-50 md:brightness-40 vid"
      src={props.m3u8Url}
      autoPlay={true}
      muted
      width="100%"
      height="100vh"
    />
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.apiUrl = process.env.REACT_APP_UMUTTEPE_API_URL;

    this.state = {
      m3u8Url: "",
      tempUnit: "C",
      weatherNow: {
        temperature: "...",
        weather: "...",
        precipPhrase: "...",
      },
      weatherDaily: [],
    };
  }

  componentDidMount() {
    Promise.all([
      fetch(`${this.apiUrl}/api/m3u8`)
        .then(
          (res) => res.json(),
          (error) => {}
        )
        .catch((error) => {}),
      fetch(`${this.apiUrl}/api/weather`)
        .then(
          (res) => res.json(),
          (error) => {}
        )
        .catch((error) => {}),
    ])
      .then(
        ([m3u8Data, weatherData]) => {
          if (!weatherData.error) {
            this.setState({
              m3u8Url: m3u8Data.url,
              weatherNow: weatherData.now,
              weatherDaily: weatherData.daily,
              tempUnit: weatherData.tempUnit,
            });
          }
        },
        (error) => {
          //
        }
      )
      .catch((error) => {
        //
      });
  }

  render() {
    return (
      <div className="App">
        <div className="vid">
          <img
            src={umuttepe}
            alt="umuttepe"
            className="vid filter brightness-40"
          />
          <img
            src={loading}
            alt="loading"
            className="vid2 w-64 h-64 opacity-30"
          />
        </div>

        <MyCustomComponent m3u8Url={this.state.m3u8Url} />
        <div className="flex justify-center items-center">
          <div className="text-center font-semibold text-white text-opacity-80 pt-20">
            <h2 className="text-3xl font-semibold">Umuttepe</h2>
            <div className="my-8">
              <div className="flex flex-col justify-center">
                <div className="text-center ml-5 mb-6">
                  <div className="flex justify-center">
                    <div>
                      <h3 className="text-9xl">
                        {this.state.weatherNow.temperature}
                      </h3>
                    </div>
                    <span className="text-3xl">°{this.state.tempUnit}</span>
                  </div>
                  <h4 className="text-2xl py-6">
                    {this.state.weatherNow.weather}
                  </h4>
                </div>
                <span> {this.state.weatherNow.precipPhrase}</span>
              </div>
            </div>

            <div className="flex justify-evenly text-center">
              {this.state.weatherDaily.map((data, id) => {
                return (
                  <div key={id} className="flex flex-1 flex-col text-center">
                    <span>{data.dayText}</span>
                    <span className="text-xl font-bold">
                      {data.temperature}°
                    </span>
                    <span className="text-sm">{data.weather}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <a
                target="_blank"
                rel="noreferrer nofollow"
                href="https://twitter.com/umuttepedehava"
                className="text-white text-opacity-70 text-xs text-center font-bold"
              >
                @umuttepedehava
              </a>
            </div>
            <div className="mx-5 mt-20">
              <span className="text-white text-opacity-70 text-xs text-center sm:max-w-xs">
                Arka plandaki görüntü canlı yayın olup
                <b>kocaeliyiseyret.com</b>
                'dan alınmıştır. Eğitim amaçlı kullanım söz konusu olup hakları
                <b>Kocaeli BB</b>'ye aittir.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
