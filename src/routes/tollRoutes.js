const mongoose = require('mongoose')
const express = require('express')
const Toll = mongoose.model('Toll');

const requireAuth = require('../middleware/requireAuth');
const { error } = require('../config/functions');
const router = express.Router();

router.get('/tolls', requireAuth, async (req, res) => {
    let { page, limit, fields, numberPlate } = req.query;
    // default page and limits
    page = !page ? 0 : parseInt(page) - 1;
    limit = !limit ? 10 : parseInt(limit);
    try {
        const tolls = await Toll.find({
            ...(numberPlate ? { numberPlate: { $regex: numberPlate } } : {}),
        })
            .select(fields ? JSON.parse(fields) : [])
            .limit(limit)
            .skip(page * limit)
            .sort({ day: -1 });
        res.send(tolls)
    } catch (err) {
        error(res, err.message);
    }
})
router.delete('/tolls/:tollID', requireAuth, async (req, res) => {
    const { tollID } = req.params;
    if (!tollID) return error(res, 'tollID is missing');
    try {
        Toll.findByIdAndDelete(tollID, { new: true }, (err, docs) => {
            if (err) return error(res, 'Could not delete toll');
            res.send(docs)
        })
    } catch (err) {
        error(res, err.message);
    }
})
router.post('/entry', requireAuth, async (req, res) => {
    const { entryPoint, day, numberPlate } = req.body;
    // validate inputs
    if (!entryPoint) return error(res, 'entryPoint is missing');
    if (!day) return error(res, 'day is missing');
    if (!numberPlate) return error(res, 'numberPlate is missing');
    if (numberPlate) {
        const split = numberPlate?.split('-');
        const letters = split[0];
        const numbers = split[1];
        if (
            (split?.length < 0 || split?.length > 2) ||
            !isNaN(parseInt(letters)) ||
            isNaN(parseInt(numbers)) ||
            letters?.length != 3 ||
            numbers?.length != 4
        ) return error(res, 'numberPlate has to be in format LLL-NNNN where L is letters and N is numbers');


        try {
            // check if toll for current vehicle already exists
            const exists = await Toll.findOne({ numberPlate });
            if (exists && !exists?.exitPoint) return error(res, 'toll entry has already been made for specified car')

            // create new entry and store it
            const toll = new Toll({ entryPoint, day, numberPlate });
            toll.save();
            res.send(toll)
        } catch (err) {
            error(res, err.message);
        }
    }
})
router.put('/exit/:tollID', requireAuth, async (req, res) => {
    const { tollID } = req.params;
    const { exitPoint, distance } = req.body;

    if (!tollID) return error(res, 'tollID is missing');
    if (!exitPoint) return error(res, 'exitPoint is missing');
    if (!distance) return error(res, 'distance is missing');
    if (isNaN(parseFloat(distance))) return error(res, 'distance has to be anumber');

    try {
        // check if toll exists
        const toll = await Toll.findById(tollID);
        if (!toll) return error(res, 'toll does not exist for specified ID');

        // check if entry was on weekend
        const date = new Date(toll.day)
        const isWeekend = date.getDay() == 6 || date.getDay() == 0; // sat = 6, sun = 0

        // constants
        const distanceRate = 0.2;
        const baseRate = 20;

        // Update values
        toll.cost = (baseRate + (distanceRate * parseFloat(distance))) * (isWeekend ? 1.5 : 1);
        toll.cost = toll.cost.toFixed(2);
        toll.exitPoint = exitPoint;
        toll.distance = parseFloat(distance);

        await toll.save();
        res.send(toll);
    } catch (err) {
        error(res, err.message);
    }
})

module.exports = router;