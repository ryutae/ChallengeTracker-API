exports.getAllGroups = (req, res) => {
  res.status(200).json({
    message: 'all the groups',
    data: []
  })
}
