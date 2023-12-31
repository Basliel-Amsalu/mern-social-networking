import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteComment } from "../../actions/post";

const CommentItem = ({ comment, postId, auth, deleteComment }) => {
  return (
    <>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${comment.user}`}>
            <img className='round-img' src={comment.avatar} alt='' />
            <h4>{comment.name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{comment.text}</p>
          <p className='post-date'>
            Posted on <Moment format='YYYY/MM/DD'>{comment.date}</Moment>
          </p>
          {!auth.loading && comment.user === auth.user._id && (
            <button
              onClick={() => deleteComment(postId, comment._id)}
              type='button'
              className='btn btn-danger'
            >
              <i className='fas fa-times'></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
