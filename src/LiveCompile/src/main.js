const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const fs = require('fs')

app.listen(PORT, (request,response)=>{
    console.log("Listening at Port",PORT)
})
app.use(express.json())

app.get('/compile',(request,response)=>{
    response.send("Use POST")
})

app.post('/compile',(request,response)=>{
    let language = request.body.language, code = request.body.code
    let timeStamp = language + (Math.round(+new Date()/1000)).toString(10) + request.body.username
    console.log(timeStamp)
    let fileWrite = {
        'WriteFile':(filename,extension,code)=>{
            fs.appendFile(filename+extension,code,(error)=>{
                if(error) throw error
                console.log('File'+filename+extension+" created.")
            })
        },
        'Python3' : (filename,code)=>{
            fileWrite.WriteFile(filename,'.py',code)
        },
        'C++11' : (filename,code)=>{
            fileWrite.WriteFile(filename,'.cpp',code)
        },
        'C' : (filename,code)=>{
            fileWrite.WriteFile(filename,'.c',code)
        }
    }
    fileWrite[language](timeStamp,code)

   response.send('y')
})

app.use((request, response, next)=>{
    response.status(404).send({error:"Not found"})
  })
