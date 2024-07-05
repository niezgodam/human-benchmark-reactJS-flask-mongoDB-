import React, { useContext, useEffect, useState } from "react";
import useMousePosition from "./useMousePosition";
import "./animatedBackground.css";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";
import { UserContext, useUserInfo } from "../../contexts/UserContext";

export default function LoginInterface() {
  const mousePosition = useMousePosition();

  useEffect(() => {
    const mask = document.querySelector(".mask");
    if (mask instanceof HTMLElement) {
      mask.style.setProperty(
        "--mouse-x",
        (mousePosition.x / window.innerWidth) * 100 + "%"
      );
      mask.style.setProperty(
        "--mouse-y",
        (mousePosition.y / window.innerHeight) * 100 + "%"
      );
    }
  }, [mousePosition]);

  const { loginUser, isAuthenticationCorrect } = useUserInfo();
  const [isLoginClicked, setIsLoginClicked] = useState(false);


  const [userLoginCredentials, setUserLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    await loginUser({
      email: "",
      username: userLoginCredentials.username,
      password: userLoginCredentials.password,
      _id: "",
    });
    setIsLoginClicked(true);
  };

  return (
    <>
      <div className="content">
        <div className="fixed top-0 bottom-0 left-0 right-0 mask"></div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="bg-[#201d22] rounded-xl max-w-[350px] xsm:max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[1000px] xl:max-w-[1200px] w-full h-[50%] my-6 px-4 flex items-center">
            <div className="w-full ">
              <div className="flex pt-2">
                <Link to="/auth" className="inline-block ">
                  <TiArrowBack
                    className="hover:scale-110"
                    size={40}
                    fill="#783dcb"
                  />
                </Link>
              </div>
              <div className="text-left text-white xsm:py-8">
                <h1 className="py-2 text-4xl text-center md:text-5xl">
                  Login to Your Account
                </h1>
              </div>
              <div className="grid items-center justify-center grid-rows-2 mx-auto my-8 text-white xsm:gap-8 xsm:flex">
                <div className="outline outline-1 outline-[#383439] sm:w-[40%] flex rounded-2xl items-center justify-center cursor-pointer hover:scale-110 hover:ease-in-out hover:duration-300 transform transition my-4 md:my-0">
                  <FcGoogle className="flex" size={40} />
                  <h1 className="py-3 my-4 text-lg font-bold xs:p-4 sm:my-0">
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">Log in with Google</a>
                  </h1>
                </div>
                <div className="outline outline-1 outline-[#383439] sm:w-[40%] flex rounded-2xl items-center justify-center cursor-pointer hover:scale-110 hover:ease-in-out hover:duration-300 transform transition my-2 md:my-0">
                    <IoLogoApple className="flex " size={40} />
                    <h1 className="py-3 my-4 text-lg font-bold xs:p-4 sm:my-0">
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">Log in with Apple</a>
                    </h1>
                </div>
              </div>
              {isLoginClicked ? (!isAuthenticationCorrect ? 
                  <div className="relative">
                    <h1 className="text-xl font-bold text-red-600 duration-300 ease-in-out">Please provide a valid username and password</h1>
                  </div> 
                  :
                  null
                  )
                :
                null
              }
              <div className="mx-8 mb-2 text-white">
                <span className="flex py-2 text-xl tracking-wider ">
                  Username
                </span>
                <input
                  className="outline outline-1 outline-[#383439] rounded-xl w-full py-4 px-2 bg-[#2c282e] text-white focus:outline-[#783dcb] focus:outline-2 hover:cursor-[url('\background.jpg')]"
                  placeholder="Username"
                  name="username"
                  onChange={(e) =>
                    setUserLoginCredentials({
                      ...userLoginCredentials,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mx-8 mb-2 text-white">
                <span className="flex py-2 text-xl tracking-wider ">
                  Password
                </span>
                <input
                  className="outline outline-1 outline-[#383439] rounded-xl w-full py-4 px-2 bg-[#2c282e] text-white focus:outline-[#783dcb] focus:outline-2"
                  placeholder="Password"
                  name="password"
                  onChange={(e) =>
                    setUserLoginCredentials({
                      ...userLoginCredentials,
                      password: e.target.value,
                    })
                  }
                  type="password"
                />
              </div>
              <div className="flex justify-center">
                <span className="flex text-2xl text-white">
                Don't have an account? &#8203;
                  <Link to="/auth">
                    <h1 className=" text-[#7632cc] text-2xl font-bold cursor-pointer hover:border-b-2 hover:border-[#7632cc] hover:font-bold">
                      Sign Up
                    </h1>
                  </Link>
                </span>
              </div>
              <div className="my-6">
                <motion.button
                  onClick={handleLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="bg-gradient-to-br input from-[#4a47d7] to-[#7632cc] p-4 font-medium text-2xl text-white rounded-xl w-[60%] border-[#783dcb]"
                >
                  Login
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
