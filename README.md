# How to Meet WCAG (Quick Reference)

Like most of the WAI Website, the Quick Reference is a [Jekyll][0001] project, with a [Gulp][0002] component that creates JS & CSS. Follow the [Jekyll Installation Instructions][0003] to install Jekyll. Unless you need to edit CSS or JS, you can ignore Gulp.

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
[0003]: https://jekyllrb.com/docs/installation/


<!-- Report:
(2:55:14): [Jekyll]() => https://jekyllrb.com/
(2:86:12): [Gulp](!g gulpjs) => https://gulpjs.com/
(2:143:40): [Jekyll Installation Instructions]() => https://jekyllrb.com/docs/installation/
(): Processed: 7 links, 1 errors.
-->
