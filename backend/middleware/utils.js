const saveUser = (req, user) => {
  req.user = user;
};

const loadUser = (req) => req.user;

const createPayload = (user) => {
  return {
    email: user.email,
    password: user.password,
    displayName: user.displayName,
    contactNumber: user.contactNumber,
    userRole: user.userRole,
    agentId: user.agentId,
    isActive: user.isActive,
    preferContactMethod: user.preferContactMethod,
    preferLocation: user.preferLocation,
    preferBudget: user.preferBudget,
    preferRooms: user.preferRooms,
  };
};

module.exports = {
  createPayload,
  saveUser,
  loadUser,
};
