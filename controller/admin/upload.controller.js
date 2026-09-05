export const imagePost = (req, res) => {
  res.json({
    location: req.file.path
  })
}