module.exports = function() {

    return function(req, res, next) {
        // TODO: get tenant id from auth user
        req.tenantId = '54c758b2aff1a55940d466a3';

        next();
    }
};