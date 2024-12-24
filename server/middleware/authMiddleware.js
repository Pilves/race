
const keys = {
    receptionist: process.env.RECEPTIONIST_KEY,
    observer: process.env.OBSERVER_KEY,
    safety: process.env.SAFETY_KEY,
};



const authorize = (role) => (req, res, next) => {
    const { accessKey } = req.body;


    const delayResponse = () => setTimeout(() => res.status(401).json({ message: 'Unauthorized' }), 500);


    if (!accessKey) {
        return delayResponse();
    }


    const validKey = keys[role];


    if (accessKey === validKey) {
        return next();
    }


    delayResponse();
};

module.exports = { authorize };
