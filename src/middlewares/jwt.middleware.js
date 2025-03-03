import jwt from "jsonwebtoken";

const jwtAuth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            data: {
                status: false,
                code: 401,
                message: "Authorization header is missing",
                response: null
            }
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            data: {
                status: false,
                code: 401,
                message: "Invalid authorization header format. Use Bearer <token>",
                response: null
            }
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            data: {
                status: false,
                code: 401,
                message: "Unauthorized user, token missing",
                response: null
            }
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload);
        
        req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };

        next();  // Proceed to the next middleware or route handler

    } catch (error) {
        return res.status(401).json({
            data: {
                status: false,
                code: 401,
                message: "Unauthorized user, invalid token",
                response: error.message
            }
        });
    }
};


const authorizeRoles = (roles = []) => {
    console.log("Allowed roles for this route:", roles);

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                data: {
                    status: false,
                    code: 401,
                    message: "Unauthorized - User information is missing.",
                    response: null
                }
            });
        }

        const { role } = req.user;
        console.log(role);
        
        if (!role) {
            return res.status(401).json({
                data: {
                    status: false,
                    code: 401,
                    message: "Unauthorized - User role is missing.",
                    response: null
                }
            });
        }

        if (!roles.includes(role)) {
            return res.status(403).json({
                data: {
                    status: false,
                    code: 403,
                    message: "Forbidden - You do not have permission to access this resource.",
                    response: null
                }
            });
        }

        // Role is authorized - proceed to the route handler
        next();
    };
};



export { jwtAuth, authorizeRoles };
