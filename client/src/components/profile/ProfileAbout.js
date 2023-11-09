import React from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({ profile }) => {
  return (
    <>
      <div class='profile-about bg-light p-2'>
        <h2 class='text-primary'>
          {profile.user.name.trim().split(" ")[0]}'s Bio
        </h2>
        {profile.bio && <p>{profile.bio}</p>}
        <div class='line'></div>
        <h2 class='text-primary'>Skill Set</h2>
        <div class='skills'>
          {profile.skills &&
            profile.skills.map((skill) => {
              return (
                <div class='p-1'>
                  <i class='fa fa-check'></i> {skill}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

ProfileAbout.propTypes = {
    profile:PropTypes.object.isRequired
};

export default ProfileAbout;
