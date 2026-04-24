export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const isAdmin = () => getUser()?.role === "admin";
export const isSpecialist = () => getUser()?.role === "specialist";
export const isClient = () => getUser()?.role === "client";

export const isLoggedIn = () => !!localStorage.getItem("token");