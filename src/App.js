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

  const handleStatus = () => {
    var value = data && data[0].field2;
    value = parseInt(value);
    // console.log(value);
    if (value < 50) {
      return "Not Good For Drinking";
    } else if (value > 50 && value < 150) {
      return "Excellent";
    } else if (value > 150 && value < 300) {
      return "Good";
    } else if (value > 300 && value < 450) {
      return "Fair";
    } else {
      return "Bad";
    }
  };

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
        `LPG Gas concentration level is exceeding ${threshold}ppm at ` +
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
          {data.length &&
            (data[0].field1 > 1500 ? (
              <p className="text-value"> Status: Bad</p>
            ) : (
              <p className="text-value">Status: Good</p>
            ))}
        </div>
        <div className="card-div">
          <h2 className="text-parameter">TDS Concentration </h2>
          {data.length ? (
            <p className="text-value">
              {" "}
              {`Measured Value: ${data[0].field2} ppm`}
            </p>
          ) : (
            <></>
          )}
          {data.length && (
            <p className="text-value"> {`Status: ${handleStatus()}`}</p>
          )}
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
          {data.length && (
            <p className="text-value"> {`Status: ${handleStatus()}`}</p>
          )}
        </div>
      </div>
      <div>
        {data.length && data[0].field1 > 1500 && (
          <div>
            {handleEmails("CO Gas", 1500)}
            {displayMessage("CO Gas")}
          </div>
        )}
        {data.length && data[0].field2 > 700 && (
          <div>
            {handleEmails("TDS", 700)}
            {displayMessage("TDS")}
          </div>
        )}
        {data.length && data[0].field3 > 1500 && (
          <div>
            {handleEmails("LPG Gas", 1500)}
            {displayMessage("LPG Gas")}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
