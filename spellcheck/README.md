# Spellcheck

This action leverages the [spellcheck-cli](https://www.npmjs.com/package/spellchecker-cli) package to run spell-checking against all the md files in a docs directory of a GH repository.

## Set Up Action

To configure the action add a yaml file with something akin to the following

```yaml
name: Spellcheck
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  spellcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Spellcheck
        uses: redis-stack/github-actions/spellcheck@main
        env:
          CONFIGURATION_FILE: .spellcheck.yml
          COMMANDS_FILE: 
```

## Configure this action

There are two configuration options for this action that you might want to look at

### CONFIGURATION_FILE

Allows you to add a configuration file to the workflow should conform to the yml/json format for configuration laid out in [spellcheck-cli](https://www.npmjs.com/package/spellchecker-cli). By default, this will use the default dictionary and will search for files through `docs/**/*.md`

### COMMANDS_FILES

The commands.json files for your repository, if there are any, if there, this action will parse them for you and use the commands & tokens from them in a separate dictionary from your primary dictionary.

### Dictionaries

Our repositories usually have some spelling that's valid in the context of the library, but may not be valid English. To overcome this challenge, we can create dictionary files that serve to handle This action uses the [spellcheck-cli](https://www.npmjs.com/package/spellchecker-cli) package, consequentially if you want to snap a baseline and generate a dictionary from where your project is, you can do so by changing your current directory to your documentation directory and running the following:

```bash
sudo npm install -g spellchecker-cli
spellchecker -f '**/*.md' -l en-US --generate-dictionary -q --no-suggestions
```
