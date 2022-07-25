const Position = require("../models/Position")
const errorHandler = require("../utils/errorHandler")


module.exports.getByCategoryId = async function (req,res) {
    try{
    const position = await Position.find({
        category: req.params.categoryId,
        user: req.user.id
    })
        res.status(200).json(position)
    }catch (e) {
    errorHandler(res,e)
    }
}

module.exports.create = async function (req,res) {
    try{
        const {name,cost,category} = req.body
        const position = await new Position({
            name: name,
            cost: cost,
            category: category,
            user: req.user.id
        }).save()
        res.status(201).json(position)

    }catch (e) {
        errorHandler(res,e)
    }
}

module.exports.delete = async function (req,res) {
    try{
        await Position.remove({_id: req.params.id})
        res.status(200).json({
            massage:"Position was deleted"
        })

    }catch (e) {
        errorHandler(res,e)
    }
}

module.exports.update = async function (req,res) {
    try{
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
            )
        res.status(200).json(position)

    }catch (e) {
        errorHandler(res,e)
    }
}
