import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({ experience }) => {
  return (
    <div>
      <h3 class='text-dark'>{experience.company}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{experience.from}</Moment> -{" "}
        {experience.current ? (
          <span>current</span>
        ) : (
          <Moment format='YYYY/MM/DD'>{experience.to}</Moment>
        )}
      </p>
      <p>
        <strong>Position: </strong>
        {experience.title}
      </p>
      {experience.description && (
        <p>
          <strong>Description: </strong>
          {experience.description}
        </p>
      )}
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
