exports.getAllChallenges = (req, res) => {
  res.status(200).json({
    message: 'all the challenges',
    data: []
  })
} 
