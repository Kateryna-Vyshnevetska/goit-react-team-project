import axios from "axios";

import { errors } from "../redux/checkErrors/errorActions";
import { addUserInfo } from "../redux/user/userActions";
import { addUserQuizInfo } from "../redux/quizInfo/quizInfoActions";
import { addUserHabits } from "../redux/habits/habitsActions";
import { addUserCigarettes } from "../redux/cigarettes/cigarettesActions";
import { addUserAuthToken } from "../redux/authToken/authTokenAction";

axios.defaults.baseURL = "https://make-it-habit-api.herokuapp.com";

export const getAllUserDataForState = (token) => async (dispatch) => {
  // Получение всей инфы по юзеру, нужно передать сюда токен из стейта
  try {
    const { data } = await axios.get("/habits", {
      headers: {
        Authorization: token,
      },
    });
    console.log(data);
    dispatch(addUserInfo(data.user));
    dispatch(addUserQuizInfo(data.user.quizInfo));
    dispatch(addUserHabits(data.habits));
    dispatch(addUserCigarettes(data.user.cigarettes));
  } catch (error) {
    dispatch(errors(error.message));
  }
};

export const signUp = (userData) => async (dispatch) => {
  // Регистрация и логин, вовращает токен в стейт
  axios
    .post("/auth/registration", userData)
    .then((res) => axios.post("/auth/login", userData))
    .then((res) => dispatch(addUserAuthToken(res.data.access_token)))
    .catch((error) => dispatch(errors(error)));
};

export const logIn = (userData) => async (dispatch) => {
  // Вход существующего юзера, возвращает токен в стейт
  axios
    .post("/auth/login", userData)
    .then((res) => dispatch(addUserAuthToken(res.data.access_token)))
    .catch((error) => dispatch(errors(error)));
};