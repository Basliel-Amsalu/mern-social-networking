import axios from "axios";
import { setAlert } from "./alert";
import {
  CLEAR_PROFILE,
  DELETE_ACCOUNT,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from "./types";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:5000/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
  } catch (err) {
    dispatch(setAlert(err.response.statusText, "danger"));
    dispatch({ type: CLEAR_PROFILE });

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    console.error(err.response);
  }
};

export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("http://localhost:5000/api/profile");
    dispatch({
      type: GET_PROFILES,
      payload: res.data.profiles,
    });
  } catch (err) {
    dispatch(setAlert(err.response.statusText, "danger"));

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    console.error(err.response);
  }
};

export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile/user/${userId}`
    );
    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
  } catch (err) {
    dispatch(setAlert(err.response.statusText, "danger"));

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    console.error(err.response);
  }
};

export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile/github/${username}`
    );
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response.statusText, "danger"));

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    console.error(err.response);
  }
};
export const createProfile =
  (profile, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(profile);
      const res = await axios.post(
        "http://localhost:5000/api/profile/",
        body,
        config
      );
      dispatch({
        type: GET_PROFILE,
        payload: res.data.profile,
      });

      dispatch(
        setAlert(edit ? "Profile updated" : "Profile Created", "success")
      );

      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, "danger"));
        });
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });

      console.error(err.response);
    }
  };

export const addExperience = (profile, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(profile);
    const res = await axios.put(
      "http://localhost:5000/api/profile/experience",
      body,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });

    dispatch(setAlert("experience added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    console.error(err.response);
  }
};

export const addEducation = (profile, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(profile);
    const res = await axios.put(
      "http://localhost:5000/api/profile/education",
      body,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });

    dispatch(setAlert("Education added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    console.error(err.response);
  }
};

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/profile/experience/${id}`
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteEducation = (eduId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/profile/education/${eduId}`
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.profile,
    });
    dispatch(setAlert("Education removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can not be undone")) {
    try {
      await axios.delete("http://localhost:5000/api/profile");
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: DELETE_ACCOUNT });

      dispatch(setAlert("your account has been permanently deleted"));
      window.location.href = "/";
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
