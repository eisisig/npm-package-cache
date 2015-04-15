# npm-package-cache

A simple script that hashes the package.json file. Stores a archive in cache folder. On next install checks if there is a file with the same hash. If so it extracts that else it will do "npm install" and then create a cached hash archive.

This script idea is heavily based on [npm-cache](https://github.com/swarajban/npm-cache) by [swarajban](https://github.com/swarajban). But without bower and composer compatibility	. I suggest you check his out.

## Requirements

**NOTE:** this scripts requires 7zip command-line tool to work

**Install with brew**

```bash
brew install p7zip
```

**Install with Chocolatey**

```bash
choco install 7zip.commandline
```

## Installation

```bash
npm install -g npm-package-cache
```

## Usage

### Install packages

```bash
npm-package-cache install
```

##### force install

You can also add `-f` to make do an `npm install --force` if you need to

```bash
npm-package-cache install -f
```

### Clean cache

To remove all cached files do

```bash
npm-package-cache clean
```

### Notice

> This script is used for personal projects. Maintenance hasn't been thought out.