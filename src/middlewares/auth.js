import { AuthUtils } from "@utils";

export default class AuthMiddleware {
    static isAuthorized(req, res, next) {
        try {
            const errorResponse = {
                status: "error",
                code: 403,
                message: "Sessão expirada. Logue novamente no sistema para obter acesso.",
            };

            // Check if the request is to '/list'
            if (req.path === '/list') {
                const token = AuthUtils.getBearerToken(req);

                // If token exists, try to decode it
                if (token) {
                    try {
                        const decodedToken = AuthUtils.decodeData(token);
                        req.auth = {
                            id: decodedToken?.id,
                        };
                    } catch (error) {
                        console.warn('Invalid token on /list route, continuing without authentication');
                    }
                }
            } else {
                const token = AuthUtils.getBearerToken(req);
                const decodedToken = AuthUtils.decodeData(token);

                if (!decodedToken || !decodedToken.id) {
                    res.status(403).json(errorResponse);
                    return;
                }

                req.auth = {
                    id: decodedToken.id,
                };
            }

            next();
        } catch (error) {
            res.status(403).json({
                status: "error",
                code: 403,
                message: "Sessão expirada. Logue novamente no sistema para obter acesso.",
            });
        }
    }
}
