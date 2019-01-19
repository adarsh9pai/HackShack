const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.listen(PORT, (req,res)=>{
    console.log("Listening at Port",PORT)
})
app.use((req, res, next)=>{
    res.status(404).send({error:"Not found"})
  })

