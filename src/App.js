import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import "./style.css";

function App() {
  const [data, setData] = useState([]);
  const [prevdate, setPrevDate] = useState(new Date());

  const fetchData = () => {
    setInterval(() => {
      fetch("https://api.thingspeak.com/channels/1927290/feeds.json?results=1")
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          setData(result.feeds);
          console.log(result.feeds);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 15000);
  };

  // const handleStatus = () => {
  //   var value = data && data[0].field2;
  //   value = parseInt(value);
  //   // console.log(value);
  //   if (value < 50) {
  //     return "Not Good For Drinking";
  //   } else if (value > 50 && value < 150) {
  //     return "Excellent";
  //   } else if (value > 150 && value < 300) {
  //     return "Good";
  //   } else if (value > 300 && value < 450) {
  //     return "Fair";
  //   } else {
  //     return "Bad";
  //   }
  // };

  const handleEmails = (subject, threshold) => {
    const date = new Date();
    console.log("jkhjhsk", prevdate.getMinutes(), date.getMinutes());
    if (date.getMinutes() <= prevdate.getMinutes()) {
      return;
    }
    const data = {
      subject: subject,
      user_name: "Srinivas Teja",
      user_email: "srinivasmoparthi17@gmail.com",
      user_message:
        `${subject} concentration level is exceeding ${threshold}ppm at ` +
        date.toString(),
    };
    setPrevDate(date);
    emailjs
      .send(
        "service_2brpslk",
        "template_xs5nn63",
        data,
        "user_8F7LBmmcSt2r8rrSGPN5q"
      )
      .then((res) => {
        console.log("success");
        return "Email notification has been successfully sent";
      })
      .catch((err) => {
        console.log(err);
        return "Email notification has been Failed";
      });
  };

  const displayMessage = (parameter) => {
    return (
      <div className="error-div">
        {" "}
        {`${parameter} Concentration level is high`} Email Notification Alert
        has been successfully sent!!!{" "}
      </div>
    );
  };
  useEffect(() => {
    fetch("https://api.thingspeak.com/channels/1927290/feeds.json?results=1")
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setData(result.feeds);
        console.log(result.feeds);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchData();
  }, []);

  return (
    <>
      <h1>Smart Monitoring Dashboard</h1>

      <div className="container">
        <div className="card-div">
          <h2 className="text-parameter">CO Gas Concentration</h2>
          {data.length ? (
            <p className="text-value">
              {" "}
              {`Measured Value: ${data[0].field1} ppm`}
            </p>
          ) : (
            <></>
          )}
          <p className="text-value-good">Acceptable Range: less than 30 ppm</p>
          <p className="text-value-bad">Threshold value : 50 ppm</p>
          {data.length &&
            (data[0].field1 > 30 ? (
              <p className="text-value">
                {" "}
                Status: <span className="text-status-bad">Bad</span>
              </p>
            ) : (
              <p className="text-value">
                Status: <span className="text-status-good">Good</span>
              </p>
            ))}
        </div>
        <div className="card-div">
          <h2 className="text-parameter">H2 Concentration </h2>
          {data.length ? (
            <p className="text-value">
              {" "}
              {`Measured Value: ${data[0].field2} ppm`}
            </p>
          ) : (
            <></>
          )}
          <p className="text-value-good">Acceptable Range: less than 10 ppm</p>
          <p className="text-value-bad">Threshold value : 15 ppm</p>
          {data.length &&
            (data[0].field2 > 10 ? (
              <p className="text-value">
                {" "}
                Status: <span className="text-status-bad">Bad</span>
              </p>
            ) : (
              <p className="text-value">
                Status: <span className="text-status-good">Good</span>
              </p>
            ))}
        </div>

        <div className="card-div">
          <h2 className="text-parameter">LPG Gas Concentration </h2>
          {data.length ? (
            <p className="text-value">
              {" "}
              {`Measured Value: ${data[0].field3} ppm`}
            </p>
          ) : (
            <></>
          )}
          <p className="text-value-good">Acceptable Range: less than 500 ppm</p>
          <p className="text-value-bad">Threshold value : 700 ppm</p>
          {data.length &&
            (data[0].field3 > 500 ? (
              <p className="text-value">
                {" "}
                Status: <span className="text-status-bad">Bad</span>
              </p>
            ) : (
              <p className="text-value">
                Status: <span className="text-status-good">Good</span>
              </p>
            ))}
        </div>

        <div className="card-div">
          <h2 className="text-parameter">TDS Concentration </h2>
          {data.length ? (
            <p className="text-value">
              {" "}
              {`Measured Value: ${data[0].field4} ppm`}
            </p>
          ) : (
            <></>
          )}
          <p className="text-value-good">Acceptable Range: less than 300 ppm</p>
          <p className="text-value-bad">Threshold value : 600 ppm</p>
          {data.length &&
            (data[0].field4 > 300 ? (
              <p className="text-value">
                {" "}
                Status: <span className="text-status-bad">Bad</span>
              </p>
            ) : (
              <p className="text-value">
                Status: <span className="text-status-good">Good</span>
              </p>
            ))}
        </div>
      </div>

      {/* Emails section */}

      <div>
        {data.length && data[0].field1 > 50 && (
          <div>
            {handleEmails("CO Gas", 50)}
            {displayMessage("CO Gas")}
          </div>
        )}
        {data.length && data[0].field2 > 15 && (
          <div>
            {handleEmails("H2", 15)}
            {displayMessage("H2")}
          </div>
        )}
        {data.length && data[0].field3 > 700 && (
          <div>
            {handleEmails("LPG Gas", 700)}
            {displayMessage("LPG Gas")}
          </div>
        )}
        {data.length && data[0].field4 > 600 && (
          <div>
            {handleEmails("TDS", 600)}
            {displayMessage("TDS")}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
