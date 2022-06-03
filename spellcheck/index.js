const {Toolkit} = require("actions-toolkit");
const childProcess = require("child_process");
const core = require("@actions/core");
const fs = require('fs').promises;
const yaml = require('js-yaml');

Toolkit.run(async tools => {
    const base_dir = process.env.BASE_DIR == null ? "/app" : process.env.BASE_DIR;
    const dir = process.env.DOCS_DIRECTORY;    
    const dictionary = process.env.DICTIONARY == null ? "/app/default_dictionary.txt" : process.env.DICTIONARY;
    const configuration_file = process.env.CONFIGURATION_FILE == null ? "/app/.spellcheck_default.yml" : process.env.CONFIGURATION_FILE;
    const commands_files = process.env.COMMANDS_FILES;

    if(commands_files){
        
        await BuildCommandsDictionaryFile(commands_files, configuration_file, base_dir);
    }
    
    if(dir != '.'){
        dictionaries = yaml.load((await fs.readFile(configuration_file)).toString()).dictionaries;
        dictionaries.forEach(async d => {
            try {
                await fs.access(`./${dir}${d}`);
            }
            catch(e){
                childProcess.execSync(`cp ${base_dir}/${d} ./${dir}`);
            }
        });

        childProcess.execSync(`cp ${configuration_file} ./${dir}/.spellchecker.yml`)
        const lsOfDir = childProcess.execSync(`ls -l ${dir}`)
        console.log(lsOfDir.toString());
    }
    
    childProcess.exec(`cd ${dir} && spellchecker --no-suggestions --config .spellchecker.yml`, (exception,out,err)=>{        
        let fail = false;
        if(err){
            tools.log.info(err);
            fail = true;
        }

        if(out){
            core.setFailed(out);
            fail = true;
        }

        if(exception)
        {
            tools.log.info(exception)
            fail = true
        }
        if(!fail){
            console.log('Spellcheck found no errors.')
        }
    });
})

function isValidRegex(str){
    try {
        new RegExp(str)
        return true;
    } catch(e) {
        return false;
    }
}

function* getArguments(obj){
    if(obj.arguments){
        for(const arg of obj.arguments){
            if(arg.token){
                for(const splitArg of arg.token.split(' ')){
                    if(isValidRegex(splitArg))
                        yield splitArg
                }
            }            
            
            for(const subArg of getArguments(arg)){
                yield subArg
            }
        }
    }
}

async function BuildCommandsDictionaryFile(commandsFile, configFile, base_dir){
    const set = new Set();
    for(file of commandsFile.split(',')){        
        const json = JSON.parse((await fs.readFile(file)).toString())
        const commands = Object.keys(json);    

        commands.forEach(element => {
            for(const token of element.split(' ')){        
                set.add(token);
            }

            for(const arg of getArguments(json[element])){
                set.add(arg);
            }
        })

    }    
    
    str = '';

    set.forEach(element => {
        str+=element;
        str+='\n';
    });

    await fs.writeFile(`${base_dir}/.command_dictionary`,str);

    configuration = yaml.load((await fs.readFile(configFile)).toString());
    configuration['dictionaries'].push('.command_dictionary');
    await fs.writeFile(configFile,yaml.dump(configuration));
}