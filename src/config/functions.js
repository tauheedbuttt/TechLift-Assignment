const error = (res, message) => res.status(404).send({ message })

module.exports = {
    error
}