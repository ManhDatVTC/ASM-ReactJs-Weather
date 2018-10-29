class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            nameCity: "Hanoi",
            mapWeather: [],
            weatherToday: {},
            nameCitySearch: "",
            notification: "",
            getDateId: "",
            saveIdDay: ""
        });

        this.onClickMapWeatherMonth = this.onClickMapWeatherMonth.bind(this);
    }
    componentDidMount() {
        fetch("https://api.weatherbit.io/v2.0/forecast/daily?city=" + this.state.nameCity + "&key=d1fd2da375fc4426888aacc104978ae6")
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                } else {
                    alert("Error" + response.statusText)
                }
            }).then(weatherContain => {
                this.setState({
                    mapWeather: weatherContain,
                    weatherToday: weatherContain.data[0],
                    getDateId: weatherContain.data[0].valid_date
                });
                this.UpdateBackgroundForBody(this.state.weatherToday.weather.code);
                document.getElementById(this.state.getDateId).className = "col-md-3 col-sm-4 col-lg-2 col-xs-2 live__scroll--box ReplaceColorDay";
            })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.nameCity !== prevState.nameCity) {
            fetch("https://api.weatherbit.io/v2.0/forecast/daily?city=" + this.state.nameCity + "&key=d1fd2da375fc4426888aacc104978ae6").then(response => {
                if (response.status == 200) {
                    this.setState({ notification: "" });
                    return response.json()
                } else {
                    this.setState({ notification: "I can't find city" });
                }
            }).then(weatherContain => {
                this.setState({
                    mapWeather: weatherContain,
                    weatherToday: weatherContain.data[0],
                    getDateId: weatherContain.data[0].valid_date
                })
                document.getElementById(this.state.getDateId).className = "col-md-3 col-sm-4 col-lg-2 col-xs-2 live__scroll--box ReplaceColorDay";
                this.setState({ saveIdDay: this.state.getDateId });
            })
        }
        if (this.state.weatherToday != prevState.weatherToday) {
            document.getElementById(this.state.getDateId).className = "col-md-3 col-sm-4 col-lg-2 col-xs-2 live__scroll--box ReplaceColorDay";
            try {
                document.getElementById(this.state.saveIdDay).className = "col-md-3 col-sm-4 col-lg-2 col-xs-2 live__scroll--box btn-special3 divHover";
            } catch (error) {

            }
            this.setState({ saveIdDay: this.state.getDateId })
            this.UpdateBackgroundForBody(this.state.weatherToday.weather.code);
        }

    }
    UpdateBackgroundForBody(value) {
        switch (value) {
            case 201: case 202: case 200: case 230: case 231: case 232: case 233:
                document.body.style.backgroundImage = "url('./IMG/Thunderstorm.jpeg')"
                break;
            case 300: case 301: case 302: case 500: case 501: case 502: case 511: case 520: case 521: case 522:
                document.body.style.backgroundImage = "url('./IMG/Rain.jpg')"
                document.body.style.color = "#FF4500"
                break;
                break;
            case 600: case 601: case 602: case 610: case 621: case 622: case 623:
                document.body.style.backgroundImage = "url('./IMG/Snow.jpeg')"
                document.body.style.color = "#FF0000"
                break;
            case 700: case 711: case 721: case 731: case 741: case 751:
                document.body.style.backgroundImage = "url('./IMG/Mist.jpeg')";
                document.body.style.color = "#FFF"
                break;
            case 800:
                document.body.style.backgroundImage = "url('./IMG/Sunny.jpeg')"
                document.body.style.color = "#DC143C"
                break;
            case 801: case 802: case 803:
                document.body.style.backgroundImage = "url('./IMG/123.jpeg')"
                document.body.style.color = "#DC143C"
                break;
            case 804:
                document.body.style.backgroundImage = "url('./IMG/Overcastclouds.jpeg')"
                document.body.style.color = "#00FF7F"
                break;
            case 900:
                document.body.style.backgroundImage = "url('./IMG/Precipitation.jpeg')"
                document.body.style.color = "#00FF7F"
                break;
            default:
                break;
        }
    }

    onClickMapWeatherMonth = (value) => {
        this.setState({ weatherToday: value });
        this.setState({ saveIdDay: this.state.getDateId });
        this.setState({ getDateId: value.valid_date.toString() });
    }

    enterKey = (value) => {
        if (value === "Enter") {
            this.setState({ nameCity: this.state.nameCitySearch });
            document.getElementById('SearchNull').value = "";
        }
    }
    render() {
        var weatherNow = this.state.weatherToday;
        var cityNameNow = this.state.mapWeather.city_name;
        var countryCodeNow = this.state.mapWeather.country_code;
        var notification = this.state.notification;
        if (this.state.mapWeather.length == 0) {
            return <div className="container">
                <div id="header-top" className="row">
                    <div className="col-md-4 col-sm-2 col-xs-4">
                        <LogoHeader />
                    </div>
                    <div className="col-md-8 col-sm-10 col-xs-8" id="header-top">
                        <Search InputValue={(value) => this.setState({ nameCitySearch: value })} confirmationSearch={this.enterKey} />
                    </div>
                </div>
            </div>
        }
        return (
            <div className="container">
                <div id="header-top" className="row" >
                    <div className="col-md-4 col-sm-4 col-xs-4">
                        <LogoHeader _HomePage={() => this.setState({ nameCity: "hanoi" })} />
                    </div>
                    <div className="col-md-8 col-sm-8 col-xs-8">
                        <Search InputValue={(value) => this.setState({ nameCitySearch: value })} confirmationSearch={this.enterKey} />
                    </div>
                </div>
                <WeatherNow value={weatherNow} country={countryCodeNow} notification={notification} nameCity={cityNameNow} />
                <MapWeatherMonth nameData={this.state.mapWeather} notification={notification} onClickMapWeatherMonth={this.onClickMapWeatherMonth}></MapWeatherMonth>
            </div>
        );
    }
}
function CityNameSearch(props) {
    return (
        <input id="SearchNull" type="search"
            onChange={(event) => props.inputCity(event.target.value)}
            onKeyPress={(event) => props.KeypressEnter(event.key)}
            placeholder="Your city name?" />
    );
}
function ButtonSearch(props) {
    return (
        <button
            onClick={() => props.EventClick(props.isClick)}>
        </button>
    );
}
class LogoHeader extends React.Component {
    render() {
        return (
            <div onClick={() => this.props._HomePage()}>
                <svg className="d-none d-sm-inline mb-3 ml-2 mr-3" xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 28 28">
                    <g>
                        <path id="path1" transform="rotate(0,14,14) translate(8.34465026855469E-07,0) scale(0.875,0.875)  "
                            fill="#FFFFFF" d="M15.530994,27.095991L16.530994,27.095991 16.530994,32 15.530994,32z M7.8219934,23.514999L8.5289917,24.222 5.0620008,27.689003 4.3550024,26.982002z M24.222001,23.470993L27.688991,26.937996 26.981994,27.644997 23.515002,24.177994z M0,15.530994L4.9040084,15.530994 4.9040084,16.530994 0,16.530994z M27.095992,15.469006L31.999999,15.469006 31.999999,16.469006 27.095992,16.469006z M15.998987,6.474987C21.259971,6.4749874 25.524007,10.739986 25.524007,15.99998 25.524007,21.259989 21.259971,25.524986 15.998987,25.524986 10.739011,25.524986 6.4750061,21.259989 6.4750061,15.99998 6.4750061,10.739986 10.739011,6.4749874 15.998987,6.474987z M5.0179954,4.355001L8.4850121,7.8220043 7.778008,8.5290051 4.3109918,5.0620012z M26.93797,4.3110037L27.644969,5.018002 24.177978,8.484993 23.470981,7.7779946z M15.469006,0L16.469006,0 16.469006,4.9039931 15.469006,4.9039931z" />
                    </g>
                </svg>
                <h4 className="d-none d-md-inline" >FORECAST</h4>
            </div>
        );
    }
}
class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({ isClick: false })
    }
    render() {
        return (
            <div >
                <CityNameSearch inputCity={(value) => this.props.InputValue(value)}
                    KeypressEnter={(value) => this.props.confirmationSearch(value)} />
                <ButtonSearch
                    EventClick={(value) => this.setState({ isClick: !value })}
                    isClick={this.state.isClick} ></ButtonSearch>
            </div>
        );
    };
}

class InformationWeatherToday extends React.Component {
    render() {
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 justify-content-end" id="main-panel">
                <p id="location">{this.props.nameCity}, {this.props.country}</p>
                <img src={this.props.img} height="80" width="80" alt="weather-icon" />
                <p class="main-deg"><span>{this.props.temp}</span><span> &deg;C</span>
                    <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="switch">
                            <p>&deg;C &deg;F</p>
                            <input type="checkbox" />
                            <div class="slider round"></div>
                        </label></span>
                </p>
                <h3>{this.props.description}</h3>
                <p id="date">Updated as of {this.props.valid_date} PM</p>
            </div>
        );
    }
}

class RenderInforFeelToday extends React.Component {
    render() {
        return (
            <div className=" col-md-2 col-sm-6 col-xs-2 mx-auto px-auto justify-content-end" className="d-inline" id="main-details" >
                <img className="" src={this.props.imgFeel} />
                <div >
                    <p className="d-none d-sm-inline ">{this.props.Feel}
                    </p><span >{this.props.value}</span><span>
                        {this.props.val}</span>
                </div>
            </div>
        );
    }
}

class WeatherNow extends React.Component {

    render() {
        if (this.props.notification == "") {
            return (
                <div className="row mx-auto px-auto d-flex justify-content-center " >
                    <InformationWeatherToday img={"https://www.weatherbit.io/static/img/icons/" + this.props.value.weather.icon + ".png"} temp={this.props.value.temp} nameCity={this.props.nameCity} country={this.props.country}
                        description={this.props.value.weather.description} valid_date={this.props.value.valid_date}></InformationWeatherToday>
                    <div className="col-md-11 col-sm-12 col-xs-11 row mx-auto px-auto justify-content-center" id="main-details">
                        <RenderInforFeelToday imgFeel="https://image.ibb.co/mjFJFF/thermometer_icon.png"
                            Feel="Feel Like " value={this.props.value.app_max_temp} val="&deg;C"></RenderInforFeelToday>
                        <RenderInforFeelToday imgFeel="https://image.ibb.co/f9Oihv/rain_drop.png"
                            Feel="Wind Speed " value={Math.floor(this.props.value.wind_spd * 3600 / 1000)} val="m/s"></RenderInforFeelToday>
                        <RenderInforFeelToday imgFeel="https://image.ibb.co/nPUCaF/humidity.png"
                            Feel="Humidity " value={this.props.value.rh} val="%"></RenderInforFeelToday>
                        <RenderInforFeelToday imgFeel="./IMG/eye.png"
                            Feel="Visibility  " value={Math.floor(this.props.value.vis)} val="km"></RenderInforFeelToday>
                        <RenderInforFeelToday imgFeel="./IMG/barometer.png"
                            Feel="Barometer  " value={this.props.value.pres} val="mb"></RenderInforFeelToday>
                    </div>
                </div>
            );
        }
        else {
            return (<div><h1 className="align-content-center">{this.props.notification}</h1></div>);
        }
    }
}
function RenderWeaderDay(props) {
    function Selectday() {
        props._Selectday(props._data);
    }
    return (
        <div id={props.getDayTime} className="col-md-3 col-sm-4 col-lg-2 col-xs-2 live__scroll--box btn-special3 divHover" onClick={Selectday}>
            <p class="hourly-degree"><span>{props._day} {props._date}</span></p>
            <img src={props.img} id="hourly-icon-0"></img>
            <div className="d-inline">
                <div><h5 className="d-inline">{props.max_temp}<sup>o</sup>&nbsp;&nbsp;&nbsp;&nbsp;</h5><span>{props.min_temp}<sup>o</sup></span></div>
            </div>
            <p>{props.description}</p>
        </div>
    );

}

class MapWeatherMonth extends React.Component {
    constructor(props) {
        super(props);
        this.onClickHandle = this.onClickHandle.bind(this);
    }

    onClickHandle(value) {
        this.props.onClickMapWeatherMonth(value);
    }
    render() {
        var dataMap = this.props.nameData.data.map(e => {
            var img = "https://www.weatherbit.io/static/img/icons/" + e.weather.icon + ".png";
            var _dateTime = new Date(e.valid_date);
            var dayArray = ["Sun", "Mom", "Tue", "Wed", "Thu", "Fri", "Sat"];
            var _day = dayArray[_dateTime.getDay()];
            var _date = _dateTime.getDate();
            return (
                <RenderWeaderDay key={e.valid_date} getDayTime={e.valid_date} img={img} _data={e} _day={_day} _date={_date}
                    max_temp={e.max_temp} min_temp={e.min_temp} description={e.weather.description} _Selectday={this.onClickHandle}></RenderWeaderDay>
            )
        });
        if (this.props.notification == "") {
            return (
                <div >
                    <h5>Daily</h5>
                    <hr className="hrBorder" />
                    <div className="scroll-btn left-scroll">
                        <i class="">
                            <img src="./IMG/next.png" onClick={(elmnt) => {
                                elmnt = document.getElementById("horizon");
                                elmnt.scrollLeft = elmnt.scrollLeft - 400;
                            }} alt="" />
                        </i>
                    </div>
                    <div className="scroll-btn right-scroll"><i>
                        <img src="./IMG/next (1).png" onClick={(elmnt) => {
                            elmnt = document.getElementById("horizon");
                            elmnt.scrollLeft = elmnt.scrollLeft + 400;
                        }} alt="" />
                    </i></div>
                    <div className="live__scroll no-gutters" id="horizon">
                        <div className="row text-center no-gutters">
                            <div className="row hourly-panel">
                                {dataMap}
                            </div>
                        </div>
                    </div>
                    <hr className="hrBorder" />
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }
}

ReactDOM.render(
    <Weather />,
    document.getElementById("root")
)