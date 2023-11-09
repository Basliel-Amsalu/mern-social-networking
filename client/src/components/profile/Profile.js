import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { Link, useParams } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
  const params = useParams();
  useEffect(() => {
    getProfileById(params.id);
  }, [getProfileById, params.id]);

  return (
    <>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link to='/profiles' class='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to={"/edit-profile"} className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div class='profile-grid my-1'>
            <ProfileTop profile={profile} />

            <ProfileAbout profile={profile} />

            <div class='profile-exp bg-white p-2'>
              <h2 class='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                profile.experience.map((experience) => (
                  <ProfileExperience
                    key={experience._id}
                    experience={experience}
                  />
                ))
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div class='profile-edu bg-white p-2'>
              <h2 class='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                profile.education.map((education) => (
                  <ProfileEducation key={education._id} education={education} />
                ))
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,

  getProfileById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profileReducer,
  auth: state.authReducer,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
