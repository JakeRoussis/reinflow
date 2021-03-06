const router = require('express').Router();
const verify = require('../../functions/verifyToken');
const Sensor = require('../../model/sensor');
const {
	registerValidation
} = require('../../functions/sensorValidation');


router.post('/', async (req, res) => {
	res.status(200).json({
		status: true,
		message: "test"
	})
})

router.post(
	'/register',
	(req, res, next) => verify(req, res, next, 3),
	async (req, res) => {
		const {
			error
		} = registerValidation(req.body);
		if (error) {
			return res.status(404).json({
				status: false,
				error: error.details[0].message
			});
		}
		console.log(req.body)
		const pointExists = await Sensor.findOne({
			location: [req.body.lon, req.body.lat]
		});

		if (pointExists)
			return res.status(400).json({
				status: false,
				error: 'Point already exists'
			});

		const sensor = new Sensor({
			sensor_name: req.body.sensorName,
			sensor_description: req.body.sensorDescription,
			lon: req.body.lon,
			lat: req.body.lat,
			location: {
				type: 'Point',
			}
		});
		try {
			const savedSensor = await sensor.save();
			return res.status(200).json({
				status: true,
				message: 'Sensor Added!',
				data: savedSensor
			});
		} catch (err) {
			res.status(400).send({
				status: false,
				error: err
			});
		}
	}
);

module.exports = router;