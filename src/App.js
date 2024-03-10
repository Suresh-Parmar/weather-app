import Search from "./images/search.webp";
import Gps from "./images/gps.svg";
import Clouds from "./images/clouds.png";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UpArrowIcon from "./images/upArrow.png";
import DownArrowIcon from "./images/downArrow.png";

function App() {
  const [city, setCity] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [finalData, setFinalData] = useState("");

  function convertEpochToDateTimeWithAMPM(epochTimestamp) {
    const date = new Date(epochTimestamp * 1000);
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    const formattedDateTime = `${hours}:${minutes} ${ampm}`;

    return formattedDateTime;
  }

  function convertEpochToDateDayTimeWithAMPM(epochTimestamp) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const date = new Date(epochTimestamp * 1000);
    const dayOfWeek = daysOfWeek[date.getDay()];
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    const formattedDateTime = `${dayOfWeek},${hours}:${minutes} ${ampm}`;

    return formattedDateTime;
  }

  function degreesToCompassDirection(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  const searchCity = async () => {
    if (city?.length > 0) {
      setSearchLoading(true);
      try {
        let result = axios({
          method: "get",
          url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7a693770337f640a941b8907d8c50419`,
        });
        result = await result;
        if (result?.status === 200) {
          let anotherResult = axios({
            method: "get",
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${result?.data?.coord?.lat}&lon=${result?.data?.coord?.lon}&appid=7a693770337f640a941b8907d8c50419`,
          });
          anotherResult = await anotherResult;
          console.log("anotherResult", anotherResult);
          if (anotherResult?.status === 200) {
            setFinalData(anotherResult?.data);
            setSearchLoading(false);
          } else {
            toast.error("Something is wrong!!!");
            setSearchLoading(false);
          }
        } else {
          toast.error("City not found");
          setSearchLoading(false);
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          toast.error("City not found");
          setSearchLoading(false);
        }
      }
    } else {
      toast.error("Enter City Name");
    }
  };

  return (
    <div className="bg-gray-300 h-screen">
      <Toaster />
      <div className="pt-[70px]">
        <div className="shadow-lg mx-5">
          <div className="flex">
            <div className="bg-white w-[25%] p-5">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <img src={Search} className="h-[23px] w-[25px]" />
                  <input
                    type="text"
                    value={city}
                    placeholder="Search for places.."
                    className="border-none focus-visible:border-none"
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <button
                    className="bg-yellow-600 px-1 py-[2px] text-white cursor-pointer rounded-md items-center"
                    onClick={() => searchCity()}
                  >
                    {searchLoading ? "Loading..." : "Search"}
                  </button>
                </div>
                <div className=" bg-gray-200 rounded-full p-2">
                  <img src={Gps} className="h-[20px] w-[20px] cursor-pointer" />
                </div>
              </div>
              <div className="mt-10">
                <img
                  src={`https://openweathermap.org/img/wn/${finalData?.weather[0]?.icon}@2x.png`}
                  className="h-[300px] w-[300px] object-cover"
                />
              </div>
              <div className="mx-5">
                <div className="">
                  <h1 className="text-[40px] font-semibold">12&deg;C</h1>
                  <span className="text-[20px] text-gray-400">
                    {convertEpochToDateDayTimeWithAMPM(finalData?.dt)}
                  </span>
                </div>
                <hr className="mt-10 mb-10" />
                <div>
                  {finalData?.weather?.map((el, i) => {
                    return (
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://openweathermap.org/img/wn/${el?.icon}@2x.png`}
                          className="h-[20px] w-[20px]"
                        />
                        <span className="font-semibold capitalize">
                          {el?.description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-gray-200 w-[75%] p-5">
              <div className="mx-10">
                <div className="flex gap-4">
                  <span className="text-gray-500 text-[20px] cursor-pointer ">
                    Today
                  </span>
                  <span className="font-bold underline text-[20px] cursor-pointer">
                    Week
                  </span>
                </div>
                <div className="mt-[80px]">
                  <div className="bg-white shadow-md text-center items-center p-3 flex flex-col w-[120px] h-[150px] rounded-xl">
                    <div className="text-[20px] mt-2  font-semibold">Sun</div>
                    <div className="mt-4">
                      <img src={Clouds} className="h-[30px] w-[30px]" />
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">15&deg;</span>
                      <span className="text-gray-500">-3&deg;</span>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <h3 className="font-semibold text-[25px]">
                    Today's Highlights
                  </h3>
                  {finalData ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white mt-5 shadow-md rounded-xl w-[250px] p-5">
                        <div className="mx-3">
                          <span className="text-gray-400 text-[20px] font-semibold">
                            UV Index
                          </span>
                          <div className="mt-5 text-center">
                            <div className="font-semibold mt-5 text-[30px]">
                              5
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white mt-5 shadow-md rounded-xl w-[250px] p-5">
                        <div className="mx-3">
                          <span className="text-gray-400 text-[20px] font-semibold">
                            Wind Status
                          </span>
                          <div className="mt-5">
                            <div className="font-semibold text-[30px]">
                              {finalData?.wind?.speed} km/h
                            </div>
                            <div className="font-semibold mt-5 text-[20px]">
                              {degreesToCompassDirection(finalData?.wind?.deg)}
                              &deg;
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white mt-5 shadow-md rounded-xl w-[250px] p-5">
                        <div className="mx-3">
                          <span className="text-gray-400 text-[20px] font-semibold">
                            Sunrise & Sunset
                          </span>
                          <div className="mt-5">
                            <div className="font-semibold flex items-center gap-2 text-[20px]">
                              <img
                                src={UpArrowIcon}
                                className="h-[30px] w-[30px]"
                              />
                              {convertEpochToDateTimeWithAMPM(
                                finalData?.sys?.sunrise
                              )}
                            </div>
                            <div className="font-semibold mt-4 flex items-center gap-2 text-[20px]">
                              <img
                                src={DownArrowIcon}
                                className="h-[30px] w-[30px]"
                              />
                              {convertEpochToDateTimeWithAMPM(
                                finalData?.sys?.sunset
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white mt-5 shadow-md rounded-xl w-[250px] p-5">
                        <div className="mx-3">
                          <span className="text-gray-400 text-[20px] font-semibold">
                            Humidity
                          </span>
                          <div className="mt-5">
                            <div className="font-semibold flex items-center gap-2 text-[20px]">
                              {finalData?.main?.humidity}%
                            </div>
                            <div className="font-semibold flex items-center mt-5 gap-2 text-[15px]">
                              Normal
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white mt-5 shadow-md rounded-xl w-[250px] p-5">
                        <div className="mx-3">
                          <span className="text-gray-400 text-[20px] font-semibold">
                            Visibility
                          </span>
                          <div className="mt-5">
                            <div className="font-semibold flex items-center gap-2 text-[20px]">
                              {finalData?.main?.humidity}%
                            </div>
                            <div className="font-semibold flex items-center mt-5 gap-2 text-[15px]">
                              Average
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white mt-5 shadow-md rounded-xl w-[250px] p-5">
                        <div className="mx-3">
                          <span className="text-gray-400 text-[20px] font-semibold">
                            Air Quality
                          </span>
                          <div className="mt-5">
                            <div className="font-semibold flex items-center gap-2 text-[20px]">
                              105
                            </div>
                            <div className="font-semibold flex items-center mt-5 gap-2 text-[15px]">
                              Unhealthy
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    "No Data Found, Enter Your Cuty"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
