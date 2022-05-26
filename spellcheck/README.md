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
          DICTIONARY: dictionary.txt
          DOCS_DIRECTORY: docs
```

## Configure this action

There are two configuration options for this action that you might want to look at

### DOCS_DIRECTORY

This is the directory where the documentation for your project is stored, e.g. `docs`

### DICTIONARY

This is the dictionary file that the the action will use to spellcheck your project. This action uses the [spellcheck-cli](https://www.npmjs.com/package/spellchecker-cli) package, consequentially if you want to snap a baseline and generate a dictionary from where your project is, you can do so by changing your current directory to your documentation directory and running the following:

```bash
sudo npm install -g spellchecker-cli
spellchecker -f '**/*.md' -l en-US --generate-dictionary -q --no-suggestions
```
