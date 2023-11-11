import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  const [csrftoken, setCsrftoken] = useState(null)
  const [baseUrl, setBaseUrl] = useState('http://localhost:8000')

  const getCSRFToken = async () => {
    const response = await fetch(`${baseUrl}/api/get-csrf-token/`)
    const data = await response.json()

    return data.csrfToken

  }


  const loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${baseUrl}/api/v1/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e?.target?.email?.value,
        password: e?.target?.password?.value,
      }),
    });

    setCsrftoken(await getCSRFToken())

    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      toast.success("Login successful!");
    } else {
      toast.error("Something went wrong! try again");
    }
  };

  const logoutUser = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    toast.success("Logout successful!");
  };

  let contextData = {
    baseUrl: baseUrl,
    user: user,
    loginUser: loginUser,
    authTokens: authTokens,
    logoutUser: logoutUser,
    csrftoken: csrftoken,
  };

  let updateToken = async () => {
    let response = await fetch(`${baseUrl}/api/v1/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    setCsrftoken(await getCSRFToken())

    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let delay_time = 40 * 60 * 1000;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, delay_time);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
