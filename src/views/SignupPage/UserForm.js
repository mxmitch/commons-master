import React, { useState, Fragment } from 'react';
import Signup from './Signup';
import Notifications from './Notifications';
import Categories from './Categories';
import Confirmation from './Confirmation';
import Success from './Success';
import axios from 'axios';
import { Typography } from '@mui/material/';

const UserForm = (props) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errors, setErrors] = useState('');
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  const [clicked, setClicked] = useState({});

  //Sets the category to clicked on categories component
  const setThisOneClicked = (key) => {
    setClicked((prev) => {
      let state = { ...prev };
      if (state[key]) {
        delete state[key];
      } else {
        state[key] = true;
      }
      return state;
    });
  };

  //Handles login submit
  const handleSubmit = async () => {
    let user = {
      name: name,
      username: username,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      postal_code: postalCode,
      email_notification: emailNotification,
      sms_notification: smsNotification,
      phone_number: phoneNumber,
      categories: Object.keys(clicked),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/users`,
        {
          user,
        }
      );
      if (response.data.status === 'created') {
        props.handleLogin(response.data);
        setStep(step + 1);
      } else {
        setErrors(response.data.errors);
      }
    } catch (error) {
      console.error(`Error occurred on Sign Up: ${error}`);
    }
  };

  const handleErrors = () => {
    return (
      <div>
        <ul>
          {errors.map((error) => {
            return (
              <li key={error}>
                <Typography variant="body1">{error}</Typography>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Proceed to next step of the signup form
  const nextStep = (justFinishedStep, data) => {
    if (justFinishedStep === 1) {
      if (data.name) {
        setName(data.name);
      }
      if (data.username) {
        setUsername(data.username);
      }
      if (data.email) {
        setEmail(data.email);
      }
      if (data.password) {
        setPassword(data.password);
      }
      if (data.passwordConfirmation) {
        setPasswordConfirmation(data.passwordConfirmation);
      }
      if (data.postalCode) {
        setPostalCode(data.postalCode);
      }
      setStep(step + 1);
    }
    if (justFinishedStep === 2) {
      setSmsNotification(data.smsNotification);
      setEmailNotification(data.emailNotification);
      setPhoneNumber(data.phoneNumber);
      setStep(step + 1);
    }
    if (justFinishedStep === 3) {
      setStep(step + 1);
    }
    if (justFinishedStep === 4) {
      handleSubmit();
    }
  };

  // Go back to prev step
  const prevStep = () => {
    setStep(step - 1);
  };

  const renderSwitch = (param) => {
    switch (param) {
      case 1:
        return (
          <Signup
            nextStep={nextStep}
            name={name}
            username={username}
            email={email}
            postalCode={postalCode}
          />
        );
      case 2:
        return (
          <Notifications
            nextStep={nextStep}
            prevStep={prevStep}
            emailNotification={emailNotification}
            smsNotification={smsNotification}
            phoneNumber={phoneNumber}
          />
        );
      case 3:
        return (
          <Categories
            categories={props.categories}
            clicked={clicked}
            setThisOneClicked={setThisOneClicked}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Confirmation
            errors={errors}
            handleErrors={handleErrors}
            prevStep={prevStep}
            nextStep={nextStep}
            details={{
              name: name,
              username: username,
              email: email,
              password: password,
              password_confirmation: passwordConfirmation,
              email_notification: emailNotification,
              sms_notification: smsNotification,
              phone_number: phoneNumber,
              categories: Object.keys(clicked),
            }}
          />
        );
      case 5:
        return <Success />;
      default:
        return <Signup nextStep={nextStep} />;
    }
  };

  return <Fragment>{renderSwitch(step)}</Fragment>;
};

export default UserForm;
