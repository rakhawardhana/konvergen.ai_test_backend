// module.exports = (req, res, next) => {
//     console.log(req.role)
//     next()
// }

exports.checkAdmin = (req, res, next) => {
    if (req.role != 'admin') {
        res.send(403, 'Forbidden')
    }
    next()
}
