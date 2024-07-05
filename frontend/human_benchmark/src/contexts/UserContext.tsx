import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

interface UserProps {
  email: string;
  username: string;
  password: string;
  _id: string;
}

interface UserProvider {
  userInfo: UserProps;
  registerUser: (info: UserProps) => Promise<void>;
  handleUserInfoFill: (e: { target: { name: string; value: string } }) => void;
  loginUser: (info: UserProps) => void;
  isUserAuthenticated: boolean;
  isAuthenticationCorrect: boolean;
  checkUserStatus: () => void;
  logoutUser: () => void;
}

interface userProviderProps {
  children: ReactNode;
}

const UserProvider = createContext({} as UserProvider);

export const useUserInfo = () => {
  return useContext(UserProvider);
};

export const UserContext = ({ children }: userProviderProps) => {
  const navigate = useNavigate();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAuthenticationCorrect, setIsAuthenticationCorrect] = useState(false);
  const [cookies] = useCookies(["csrftoken"]);
  const [userInfo, setUserInfo] = useState<UserProps>({
    email: "",
    username: "",
    password: "",
    _id: "",
  });

  const registerUser = async (info: UserProps) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/auth",
        {
          email: info.email,
          username: info.username,
          password: info.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserInfoFill = (e: {
    target: { name: string; value: string };
  }) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (info: UserProps) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/login",
        {
          username: info.username,
          password: info.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        const userObject = {
          id: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
        };
        sessionStorage.setItem("user", JSON.stringify(userObject));
        sessionStorage.setItem(
          "token",
          JSON.stringify(res.data.user.csrftoken)
        );

        document.cookie = `csrftoken=${res.data.user.csrftoken}`;
        console.log(res.data);
        navigate("/");
        setIsAuthenticationCorrect(true);
      }
    } catch (err) {
      console.log(err);
      setIsAuthenticationCorrect(false);
    }
  };

  const checkUserStatus = () => {
    const userStringified = sessionStorage.getItem("user");

    if (cookies.csrftoken && userStringified) {
      setIsUserAuthenticated(true);
      const user = JSON.parse(userStringified);
      setUserInfo({
        email: user.email,
        username: user.username,
        password: "",
        _id: user._id,
      });
    } else {
      setIsUserAuthenticated(false);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    }
  };

  const logoutUser = () => {};

  return (
    <UserProvider.Provider
      value={{
        userInfo,
        registerUser,
        loginUser,
        handleUserInfoFill,
        isUserAuthenticated,
        isAuthenticationCorrect,
        checkUserStatus,
        logoutUser,
      }}
    >
      {children}
    </UserProvider.Provider>
  );
};
