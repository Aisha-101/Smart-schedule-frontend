export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const isAdmin = () => getUser()?.role === "ADMIN";
export const isSpecialist = () => getUser()?.role === "SPECIALIST";
export const isClient = () => getUser()?.role === "CLIENT";

export const isLoggedIn = () => !!localStorage.getItem("token");