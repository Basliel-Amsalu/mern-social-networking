import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({ education }) => {
  return (
    <div>
      <h3>{education.school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{education.from}</Moment> -{" "}
        {education.current ? (
          <span>current</span>
        ) : (
          <Moment format='YYYY/MM/DD'>{education.to}</Moment>
        )}
      </p>
      <p>
        <strong>Degree: </strong>
        {education.degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {education.fieldofstudy}
      </p>
      {education.description && (
        <p>
          <strong>Description: </strong>
          {education.description}
        </p>
      )}
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
