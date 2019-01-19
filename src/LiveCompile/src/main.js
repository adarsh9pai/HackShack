const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const fs = require('fs')
const exec = require('child_process').exec


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

    let writeCompile = {
        'Python3' : (filename,code)=>{
            writeCompile.WriteFile(filename,'.py',code,'Python3')
        },
        'C++11' : (filename,code)=>{
            writeCompile.WriteFile(filename,'.cpp',code,'C++11')
        },
        'C' : (filename,code)=>{
            writeCompile.WriteFile(filename,'.c',code,'C')
        },

        'WriteFile':(timestamp,extension,code,language)=>{
            fs.appendFile(timestamp+extension,code,(error)=>{
                if(error) throw error
                console.log('File '+timestamp+extension+" created.")
                writeCompile.Compile(timestamp+extension,language,timestamp)
            })
        },

        'Compile':(filename,language,timestamp)=>{
            if(language === 'Python3'){
               exec('python3 '+filename,(error,stdout,stderr)=>{
                if(error){
                    console.log(error)
                    response.send({error:'There seems to be an error on our side. Please try again later.'})
                }
                else{
                    response.send({stdout:stdout,stderr:stderr})
                    exec('rm -f '+filename).unref()
                }
               })
            }
            if(language === 'C++11'){
                exec('g++ '+filename+' '+'-o '+timestamp+'Executable -std=c++11 ',(error,stdout,stderr)=>{
                    if(error){
                        console.log(error)
                        console.log({error:'There seems to be an error on our side. Please try again later.'})
                    }
                    else{
                        exec('./'+timestamp+'Executable',(error,stdout,stderr)=>{
                            if(error){
                                console.log(error)
                                console.log({error:'There seems to be an error on our side. Please try again later.'})
                            }
                            else{
                                response.send({Output:stdout})
                                exec('rm -f '+filename).unref()
                                exec('rm -f '+timestamp+"Executable").unref()
                                console.log('Executable and file deleted.')
                            }
                           })        
                    }
                   })
            } 

            if(language === 'C'){
                exec('gcc '+filename+' -o '+timestamp+"Executable",(error,stdout,stderr)=>{
                    if(error){
                        console.log(error)
                        console.log({error:'There seems to be an error on our side. Please try again later.'})
                    }
                    else{
                        exec('./'+timestamp+"Executable",(error,stdout,stderr)=>{
                            if(error){
                                console.log(error)
                                console.log({error:'There seems to be an error on our side. Please try again later.'})
                            }
                            else{
                                response.send({Output:stdout})
                                exec('rm -f '+filename).unref()
                                exec('rm -f '+timestamp+"Executable").unref()
                                console.log('Executable and file deleted.')

                            }
                           })        
                    }
                   })
            } 
        },
    }

    writeCompile[language](timeStamp,code)
})

app.use((request, response, next)=>{
    response.status(404).send({error:"Not found"})
  })
