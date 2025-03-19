# How to Meet WCAG (Quick Reference)

Like most of the WAI Website, the Quick Reference is a [Jekyll][0001] project, with a [Gulp][0002] component that creates JS & CSS.

## Setup

1. If you have never used Jekyll before: Follow the [Jekyll Installation Instructions](https://jekyllrb.com/docs/installation/) to install prerequisites
2. Run `bundle install` in the repo's root folder

Additionally, if you will need to edit CSS or JS:

3. If you have never used Node.js before: [Install Node.js LTS](https://nodejs.org/en/download)
4. Run `npm i` in the repo's root folder

### Linux Troubleshooting

If `bundle install` encounters an error while installing nokogiri, related to libxml2's `config.sub`:

1. Install `pkg-config` and development files for libxml2 and libxslt (e.g. `libxml2-dev` and `libxslt-dev` on Debian or Ubuntu)
1. Run `NOKOGIRI_USE_SYSTEM_LIBRARIES=1 bundle install`

## Rebuilding CSS and JS

CSS and JS are built via gulp tasks, which are exposed as npm scripts for convenience.

- `npm run scss` will rebuild `css/styles.css` and `css/styles.min.css`
- `npm run js` will run lint and rebuild `js/script.js`
- `npm run watch` will watch for SCSS and JS changes and rebuild when necessary
  - This can be run in a separate terminal alongside `bundle exec jekyll serve --incremental`
    for development; note that Jekyll will need to run a rebuild pass after gulp)

## Updating wcag.json

Run `npm run json`.

This requires Node.js v20 or higher, for the built-in `fetch` global.

## Data

The data is saved as [wcag21.json](https://github.com/w3c/wai-wcag-quickref/blob/gh-pages/_data/wcag21.json) in the `_data` directory. Due to the complexity of the WCAG standard, the JSON file format is also quite complex. The data is exported from the [WCAG source code](https://github.com/w3c/wcag) and handed over to this repository.

**Note:** In the past SC text or techniques have been missing from the export. Unfortunately due to the complex nature and different formatting of the export, it was impossible to spot potential gaps in the new files. Usually the public is quick to inform us about missing data.

## Generation of the Files to Upload

After checking out/updating this repository and installing Jekyll dependencies, use the following command to generate a new version of “How to Meet WCAG (Quick Reference)”:

```bash
bundle exec jekyll build --config "_config.yml,_config_prod.yml" --profile
```

This RewriteRule "^([cij].+)" "20191004/$1"command generates a `_site` folder with the generated page and associated JS/CSS files and graphics. On a fast computer, this takes a few seconds.

Rename the `_site` folder to the current date in the format `YYYYMMDD`, for example `20210110` for January 10, 2021. Then move the folder to the W3C CVS inside the folder [`/WWW/WAI/WCAG21/quickref/`](https://cvs.w3.org/Team/WWW/WAI/WCAG21/quickref/). Edit the [`.htaccess` in the same folder](https://cvs.w3.org/Team/WWW/WAI/WCAG21/quickref/.htaccess) and replace the previous date in the following two lines with the new date:

```text
RewriteRule "^$" "YYYYMMDD/index.html"
```
and
```text
RewriteRule "^([cij].+)" "YYYYMMDD/$1"
```

After adding the directory and changing the `.htaccess` file, commit all files and the new version of the quick reference is online.

[0001]: https://jekyllrb.com/
[0002]: https://gulpjs.com/


<!-- Report:
(2:55:14): [Jekyll]() => https://jekyllrb.com/
(2:86:12): [Gulp](!g gulpjs) => https://gulpjs.com/
(2:143:40): [Jekyll Installation Instructions]() => https://jekyllrb.com/docs/installation/
(): Processed: 7 links, 1 errors.
-->
