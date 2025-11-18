import PropTypes from 'prop-types';

const CollaboratorBall = ({ user }) => {
    const initial = user.username?.charAt(0).toUpperCase() || "?";
    return (
        <span
            key={user.user_id}
            data-cy="userEmail"
            className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-blue-500 border-2 border-white rounded-full hover:bg-blue-600 transition-colors"
        >
            {initial}
        </span>
    );
};

export const CollaboratorBalls = ({ users }) => {
    return (
        <div className="flex -space-x-2">
            {users.map((user) => (
                <CollaboratorBall key={user.user_id} user={user} />
            ))}
        </div>
    );
};

CollaboratorBall.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        username: PropTypes.string,
    }).isRequired,
};

CollaboratorBalls.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            user_id: PropTypes.string.isRequired,
            username: PropTypes.string,
        })
    ).isRequired,
};
