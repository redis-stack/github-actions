const {Toolkit} = require("actions-toolkit");
const childProcess = require("child_process");
const core = require("@actions/core")

Toolkit.run(async tools => {
    const dir = process.env.DOCS_DIRECTORY;
    const dictionary = process.env.DICTIONARY == null ? "/app/default_dictionary.txt" : process.env.DICTIONARY;
    childProcess.execSync(`cp ${dictionary} ./${dir}`);    
    childProcess.exec(`cd ./${dir} && spellchecker --no-suggestions -f '**/*.md' -l en-US -q -d ${dictionary}`, (exception,out,err)=>{        
        tools.log.info(err);        
        if(out){
            core.setFailed(out);
        }        
        tools.log.info(exception)
    });    
})