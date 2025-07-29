'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useUser } from './context/user_context';
import Card from './ui/card';

export default function Review() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [usernameInputVal, setUsernameInputVal] = useState<string>('');
  const [passwordInputVal, setPasswordInputVal] = useState<string>('');
  const [confirmPasswordInputVal, setConfirmPasswordInputVal] = useState<string>('');
  const [emailInputVal, setEmailnameInputVal] = useState<string>('');

  const handleLogin = async () => {
    let success = false;
    try {
      const requestBody = {
        username: usernameInputVal,
        password: passwordInputVal,
      };
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      const res = await fetch(`http://localhost:8080/api/users/login`, requestOptions);

      if (!res.ok) {
        throw new Error('Could not log in, please try again');
      } else {
        const authDTO = await res.json();
        const userObj = {
          username: usernameInputVal,
          userId: authDTO['userId'],
          token: authDTO['token'],
        };
        setUser(userObj);
        success = true;
      }
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      if (success) {
        router.push('/my_decks');
      }
    }
  };

  const handleRegister = async (e: any) => {
    if (passwordInputVal != confirmPasswordInputVal) {
      setLoginError('Passwords must match');
      return;
    }

    let success = false;
    try {
      const requestBody = {
        username: usernameInputVal,
        password: passwordInputVal,
        confirmPassword: confirmPasswordInputVal,
        email: emailInputVal,
      };
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      const res = await fetch(`http://localhost:8080/api/users/signup`, requestOptions);

      if (!res.ok) {
        throw new Error('Could not register, please try again');
      } else {
        const authDTO = await res.json();
        const userObj = {
          username: usernameInputVal,
          userId: authDTO['userId'],
          token: authDTO['token'],
        };
        setUser(userObj);
        success = true;
      }
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      if (success) {
        router.push('/my_decks');
      }
    }
  };

  const handleUsernameChange = (e: any) => {
    setUsernameInputVal(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPasswordInputVal(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPasswordInputVal(e.target.value);
  };

  const handleEmailChange = (e: any) => {
    setEmailnameInputVal(e.target.value);
  };

  return (
    <div className="justify-self-center w-140 p-8">
      <Card>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-1">Please login or create an account</h1>
          <hr className="mb-2 opacity-30" />
          {loginError && <p>{loginError}</p>}
          {isLoginMode ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="mb-5">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={usernameInputVal}
                  onChange={(e) => {
                    handleUsernameChange(e);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={passwordInputVal}
                  onChange={handlePasswordChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer"
              >
                Login
              </button>
              <span className="mt-2 ml-2">
                Don't have an account?{' '}
                <u
                  onClick={() => {
                    setIsLoginMode(false);
                  }}
                >
                  Sign Up
                </u>
              </span>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister(e);
              }}
            >
              <div className="mb-5">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={usernameInputVal}
                  onChange={(e) => {
                    handleUsernameChange(e);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={passwordInputVal}
                  onChange={handlePasswordChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPasswordInputVal}
                  onChange={handleConfirmPasswordChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={emailInputVal}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer"
              >
                Register
              </button>
              <span className="mt-2 ml-2">
                Already have an account?{' '}
                <u
                  onClick={() => {
                    setIsLoginMode(true);
                  }}
                >
                  Log In
                </u>
              </span>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
